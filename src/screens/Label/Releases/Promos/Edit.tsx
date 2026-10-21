import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type StaticScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { borderRadius, colors, spacing } from '../../../../constants/design';
import { AppText } from '../../../../components/atoms/AppText';
import { Button } from '../../../../components/atoms/Button';
import { Checkbox } from '../../../../components/atoms/CheckBox';
import { ErrorMessage } from '../../../../components/atoms/ErrorMessage';
import { LoadingBlock } from '../../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../../components/molecules/EmptyState';
import { ErrorState } from '../../../../components/molecules/ErrorState';
import { LabeledInput } from '../../../../components/molecules/LabeledInput';
import { MetaDataRow } from '../../../../components/molecules/MetaDataRow';
import { usePromoDetail } from '../../../../features/promos/usePromoDetail';
import { useRecipientLists } from '../../../../features/recipients/useRecipientLists';
import { cancelPromo, sendPromo, updatePromo } from '../../../../services/api/promosApi';
import type { PromoStatus } from '../../../../types/promos';
import type { UpdatePromoBody } from '../../../../types/promos/updatePromoBody';

type LabelReleasesPromosEditScreenProps = StaticScreenProps<{ promoId: string }>;

type PromosStackParamList = {
  List: undefined;
  New: undefined;
  Details: { promoId: string };
  Edit: { promoId: string };
};

type SendType = NonNullable<UpdatePromoBody['sendType']>;

// El mapa de estados está repetido en PromoRow y Details, pero ahí es privado y no se puede
// importar. Si otra pantalla lo llega a necesitar, habría que pasarlo a un archivo de constants.
const STATUS_LABEL: Record<PromoStatus, string> = {
  DRAFT: 'Borrador',
  SCHEDULED: 'Programada',
  SENDING: 'Enviando',
  SENT: 'Enviada',
  CANCELLED: 'Cancelada',
  FAILED: 'Falló',
  EXPIRED: 'Expirada',
};

// Fechas ISO de promo (con hora): se muestra solo el día, igual que en el resto de pantallas.
function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

// La API manda la fecha de release como YYYY-MM-DD. No se pasa por `new Date()` porque en UTC-3
// mostraría el día anterior.
function formatReleaseDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Pantalla para editar una promo del label: cambia el tipo de envío, la fecha y las listas de
 * destinatarios (PATCH /promos/:id). El release no se puede cambiar. También deja enviar o
 * cancelar la promo según en qué estado esté.
 */
export function LabelReleasesPromosEditScreen({ route }: LabelReleasesPromosEditScreenProps) {
  const promoState = usePromoDetail(route.params.promoId);
  const recipientListsState = useRecipientLists();
  const navigation = useNavigation<NativeStackNavigationProp<PromosStackParamList>>();

  const [sendType, setSendType] = useState<SendType>('IMMEDIATE');
  const [scheduledAt, setScheduledAt] = useState('');
  const [recipientListIds, setRecipientListIds] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{
    recipients?: string;
    scheduledAt?: string;
  }>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState<'send' | 'cancel' | null>(null);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null);
  const [seeded, setSeeded] = useState(false);

  const promo = promoState.status === 'success' ? promoState.data : null;

  // Se rellena el formulario una sola vez con los datos de la promo, así si recarga la
  // pantalla no se borra lo que el usuario ya había escrito. La promo no trae todo lo que
  // necesita el formulario:
  // - sendType no viene, se saca de la fecha (si tiene fecha es "programada")
  // - recipientListIds tampoco viene solo, se arma con los ids de las listas
  useEffect(() => {
    if (!promo || seeded) return;
    setScheduledAt(promo.scheduledAt ?? '');
    setSendType(promo.scheduledAt ? 'SCHEDULED' : 'IMMEDIATE');
    setRecipientListIds((promo.recipientLists ?? []).map((list) => list.id));
    setSeeded(true);
  }, [promo, seeded]);

  // Cuando sale bien se vuelve a Details con reset en vez de goBack, porque con goBack la
  // pantalla de Details queda como estaba y no recarga los datos. Al resetear, Details se crea
  // de nuevo y pide la promo otra vez (mismo criterio que RecipientLists/Edit).
  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => {
      navigation.reset({
        index: 1,
        routes: [{ name: 'List' }, { name: 'Details', params: { promoId: route.params.promoId } }],
      });
    }, 1200);
    return () => clearTimeout(timeout);
  }, [success, navigation, route.params.promoId]);

  if (promoState.status === 'loading' || recipientListsState.status === 'loading') {
    return <LoadingBlock label="Cargando promo..." />;
  }

  if (promoState.status === 'error') {
    return <ErrorState message={promoState.message} onRetry={promoState.reload} />;
  }

  if (recipientListsState.status === 'error') {
    return <ErrorState message={recipientListsState.message} onRetry={recipientListsState.reload} />;
  }

  // Todavía no se cargaron los datos de la promo en el formulario: se espera así no se ve un
  // formulario vacío.
  if (!promo || !seeded) {
    return <LoadingBlock label="Cargando promo..." />;
  }

  if (success) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          padding: spacing.lg,
          gap: spacing.lg,
        }}
      >
        <AppText variant="headline-lg">{success.title}</AppText>
        <AppText variant="body-lg" color={colors.onSurface.variant}>
          {success.message}
        </AppText>
      </SafeAreaView>
    );
  }

  const recipientLists = recipientListsState.data.lists;
  const releaseSubtitle = [promo.release.artistName, promo.release.labelName].filter(Boolean).join(' · ');
  const sentOn = formatDate(promo.sentAt);
  const isBusy = isSubmitting || pendingAction !== null;

  // En los docs no dice en qué estados se puede hacer cada cosa, así que se tomó como supuesto
  // que guardar y enviar es solo cuando la promo está en borrador, y cancelar solo cuando está
  // programada. En los otros estados los botones no se muestran o se deshabilitan.
  const canSave = promo.status === 'DRAFT';
  const canSend = promo.status === 'DRAFT';
  const canCancel = promo.status === 'SCHEDULED';

  const toggleRecipientList = (listId: string) => {
    setRecipientListIds((currentIds) =>
      currentIds.includes(listId)
        ? currentIds.filter((currentId) => currentId !== listId)
        : [...currentIds, listId],
    );
    setFieldErrors((currentErrors) => ({ ...currentErrors, recipients: undefined }));
  };

  // Mismas reglas que New.tsx, solo para los campos editables que acepta el PATCH.
  function validate(): typeof fieldErrors {
    const errors: typeof fieldErrors = {};
    const normalizedScheduledAt = scheduledAt.trim();

    if (recipientListIds.length === 0) {
      errors.recipients = 'Seleccioná al menos una lista de destinatarios.';
    }
    if (sendType === 'SCHEDULED') {
      if (!normalizedScheduledAt) {
        errors.scheduledAt = 'Ingresá la fecha programada.';
      } else if (Number.isNaN(Date.parse(normalizedScheduledAt))) {
        errors.scheduledAt = 'Usá una fecha ISO válida.';
      }
    }
    return errors;
  }

  async function handleSubmit() {
    const errors = validate();
    setFieldErrors(errors);
    setRequestError(null);
    if (Object.keys(errors).length > 0) return;

    // La fecha se manda en formato ISO, igual que en New.tsx, pero solo si el envío es
    // programado. useCuratedDb y expiresAt no se tocan, el servidor deja como estaban esos
    // valores si no llegan.
    setIsSubmitting(true);
    try {
      await updatePromo(route.params.promoId, {
        sendType,
        recipientListIds,
        ...(sendType === 'SCHEDULED'
          ? { scheduledAt: new Date(scheduledAt.trim()).toISOString() }
          : {}),
      });
      setSuccess({ title: 'Promo actualizada', message: 'Los cambios se guardaron correctamente.' });
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'No se pudo guardar la promo');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSend() {
    setPendingAction('send');
    setRequestError(null);
    try {
      await sendPromo(route.params.promoId);
      setSuccess({ title: 'Promo enviada', message: 'El envío manual se inició correctamente.' });
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'No se pudo enviar la promo');
    } finally {
      setPendingAction(null);
    }
  }

  async function handleCancel() {
    setPendingAction('cancel');
    setRequestError(null);
    try {
      await cancelPromo(route.params.promoId);
      setSuccess({ title: 'Promo cancelada', message: 'La promo programada se canceló.' });
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'No se pudo cancelar la promo');
    } finally {
      setPendingAction(null);
    }
  }

  function handleCancelPress() {
    Alert.alert(
      'Cancelar promo',
      '¿Seguro que querés cancelar esta promo programada? No se puede deshacer.',
      [
        { text: 'Volver', style: 'cancel' },
        { text: 'Cancelar promo', style: 'destructive', onPress: handleCancel },
      ],
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: spacing.xs }}>
          <AppText variant="headline-lg">Editar promo</AppText>
          <AppText variant="body-sm" color={colors.onSurface.variant}>
            Ajustá el envío y las listas que van a recibirla.
          </AppText>
        </View>

        <View>
          <MetaDataRow label="Estado" value={STATUS_LABEL[promo.status]} />
          <MetaDataRow label="Enviada el" value={sentOn ?? 'Sin enviar'} />
          {promo.release.catalogNumber ? (
            <MetaDataRow label="Catálogo" value={promo.release.catalogNumber} />
          ) : null}
          <MetaDataRow label="Tipo" value={promo.release.type ?? '—'} />
          {promo.release.releaseDate ? (
            <MetaDataRow label="Fecha de lanzamiento" value={formatReleaseDate(promo.release.releaseDate)} />
          ) : null}
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="label-caps" color={colors.onSurface.variant}>
            Release (solo lectura)
          </AppText>
          <View
            style={{
              padding: spacing.md,
              gap: spacing.xs,
              backgroundColor: colors.surface.container,
              borderWidth: 1,
              borderColor: colors.surface.border,
              borderRadius: borderRadius.md,
            }}
          >
            <AppText variant="body-lg">{promo.release.title}</AppText>
            {releaseSubtitle ? (
              <AppText variant="body-sm" color={colors.onSurface.variant}>
                {releaseSubtitle}
              </AppText>
            ) : null}
          </View>
          <AppText variant="body-sm" color={colors.onSurface.variant}>
            El release de una promo no se puede cambiar.
          </AppText>
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="label-caps" color={colors.onSurface.variant}>
            Tipo de envío
          </AppText>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              label="Inmediato"
              variant={sendType === 'IMMEDIATE' ? 'primary' : 'secondary'}
              disabled={isBusy}
              onPress={() => {
                setSendType('IMMEDIATE');
                setScheduledAt('');
                setFieldErrors((currentErrors) => ({
                  ...currentErrors,
                  scheduledAt: undefined,
                }));
              }}
            />
            <Button
              label="Programado"
              variant={sendType === 'SCHEDULED' ? 'primary' : 'secondary'}
              disabled={isBusy}
              onPress={() => setSendType('SCHEDULED')}
            />
          </View>
          {sendType === 'SCHEDULED' ? (
            <LabeledInput
              label="Fecha programada"
              placeholder="2026-10-20T15:00:00-03:00"
              value={scheduledAt}
              onChangeText={(value) => {
                setScheduledAt(value);
                setFieldErrors((currentErrors) => ({
                  ...currentErrors,
                  scheduledAt: undefined,
                }));
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isBusy}
              error={fieldErrors.scheduledAt}
            />
          ) : null}
        </View>

        <View style={{ gap: spacing.xs }}>
          <AppText variant="label-caps" color={colors.onSurface.variant}>
            Listas de destinatarios
          </AppText>
          {recipientLists.length === 0 ? (
            <EmptyState message="Necesitás crear una lista de destinatarios antes de editar una promo." />
          ) : (
            recipientLists.map((list) => {
              const isSelected = recipientListIds.includes(list.id);
              const recipientLabel =
                list.recipientCount === 1
                  ? '1 destinatario'
                  : `${list.recipientCount} destinatarios`;
              return (
                <Checkbox
                  key={list.id}
                  label={`${list.name} · ${recipientLabel}`}
                  status={
                    isBusy
                      ? isSelected
                        ? 'disabledMarked'
                        : 'disabledUnmarked'
                      : isSelected
                        ? 'marked'
                        : 'unmarked'
                  }
                  onChange={() => toggleRecipientList(list.id)}
                />
              );
            })
          )}
          {fieldErrors.recipients ? <ErrorMessage message={fieldErrors.recipients} /> : null}
        </View>

        {requestError ? <ErrorMessage message={requestError} /> : null}

        <Button
          label="Guardar"
          loading={isSubmitting}
          disabled={isBusy || !canSave}
          onPress={handleSubmit}
        />

        {canSend || canCancel ? (
          <View style={{ gap: spacing.sm }}>
            {canSend ? (
              <Button
                label="Enviar"
                variant="secondary"
                loading={pendingAction === 'send'}
                disabled={isBusy}
                onPress={handleSend}
              />
            ) : null}
            {canCancel ? (
              <Button
                label="Cancelar promo"
                variant="secondary"
                loading={pendingAction === 'cancel'}
                disabled={isBusy}
                onPress={handleCancelPress}
              />
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

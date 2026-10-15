import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../../components/atoms/AppText';
import { Button } from '../../../../components/atoms/Button';
import { Checkbox } from '../../../../components/atoms/CheckBox';
import { ErrorMessage } from '../../../../components/atoms/ErrorMessage';
import { LoadingBlock } from '../../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../../components/molecules/EmptyState';
import { ErrorState } from '../../../../components/molecules/ErrorState';
import { LabeledInput } from '../../../../components/molecules/LabeledInput';
import { borderRadius, colors, spacing } from '../../../../constants/design';
import { useRecipientLists } from '../../../../features/recipients/useRecipientLists';
import { useReleases } from '../../../../features/releases/useReleases';
import { createPromo, type CreatePromoBody } from '../../../../services/api/promosApi';

type SendType = CreatePromoBody['sendType'];

export function LabelReleasesPromosNewScreen() {
  const releasesState = useReleases();
  const recipientListsState = useRecipientLists();
  const [releaseId, setReleaseId] = useState<string | null>(null);
  const [sendType, setSendType] = useState<SendType>('IMMEDIATE');
  const [recipientListIds, setRecipientListIds] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    release?: string;
    recipients?: string;
    scheduledAt?: string;
  }>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasCreated, setWasCreated] = useState(false);

  if (releasesState.status === 'loading' || recipientListsState.status === 'loading') {
    return <LoadingBlock label="Cargando datos del formulario..." />;
  }

  if (releasesState.status === 'error') {
    return (
      <ErrorState
        message={releasesState.message}
        onRetry={() => {
          releasesState.reload();
          recipientListsState.reload();
        }}
      />
    );
  }

  if (recipientListsState.status === 'error') {
    return (
      <ErrorState
        message={recipientListsState.message}
        onRetry={() => {
          releasesState.reload();
          recipientListsState.reload();
        }}
      />
    );
  }

  const releases = releasesState.data;
  const recipientLists = recipientListsState.data.lists;

  const clearForm = () => {
    setReleaseId(null);
    setSendType('IMMEDIATE');
    setRecipientListIds([]);
    setScheduledAt('');
    setFieldErrors({});
    setRequestError(null);
    setWasCreated(false);
  };

  const toggleRecipientList = (listId: string) => {
    setRecipientListIds((currentIds) =>
      currentIds.includes(listId)
        ? currentIds.filter((currentId) => currentId !== listId)
        : [...currentIds, listId],
    );
    setFieldErrors((currentErrors) => ({ ...currentErrors, recipients: undefined }));
    setRequestError(null);
  };

  const handleSubmit = async () => {
    const nextErrors: typeof fieldErrors = {};
    const normalizedScheduledAt = scheduledAt.trim();

    if (!releaseId) {
      nextErrors.release = 'Seleccioná un release.';
    }
    if (recipientListIds.length === 0) {
      nextErrors.recipients = 'Seleccioná al menos una lista de destinatarios.';
    }
    if (sendType === 'SCHEDULED') {
      if (!normalizedScheduledAt) {
        nextErrors.scheduledAt = 'Ingresá la fecha programada.';
      } else if (Number.isNaN(Date.parse(normalizedScheduledAt))) {
        nextErrors.scheduledAt = 'Usá una fecha ISO válida.';
      }
    }

    setFieldErrors(nextErrors);
    setRequestError(null);
    if (!releaseId || Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createPromo({
        releaseId,
        sendType,
        recipientListIds,
        ...(sendType === 'SCHEDULED'
          ? { scheduledAt: new Date(normalizedScheduledAt).toISOString() }
          : {}),
      });
      setWasCreated(true);
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'No se pudo crear la promo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (wasCreated) {
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
        <AppText variant="headline-lg">Promo creada</AppText>
        <AppText variant="body-lg" color={colors.onSurface.variant}>
          La promo se guardó correctamente.
        </AppText>
        <Button label="Crear otra promo" onPress={clearForm} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: spacing.xs }}>
          <AppText variant="headline-lg">Nueva promo</AppText>
          <AppText variant="body-sm" color={colors.onSurface.variant}>
            Elegí el release, el envío y las listas que van a recibirla.
          </AppText>
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="label-caps" color={colors.onSurface.variant}>
            Release
          </AppText>
          {releases.length === 0 ? (
            <EmptyState message="Necesitás crear un release antes de crear una promo." />
          ) : (
            releases.map((release) => {
              const isSelected = releaseId === release.id;
              return (
                <Pressable
                  key={release.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  disabled={isSubmitting}
                  onPress={() => {
                    setReleaseId(release.id);
                    setFieldErrors((currentErrors) => ({
                      ...currentErrors,
                      release: undefined,
                    }));
                    setRequestError(null);
                  }}
                  style={{
                    padding: spacing.md,
                    gap: spacing.xs,
                    backgroundColor: isSelected
                      ? colors.surface.containerHighest
                      : colors.surface.container,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? colors.primary.default
                      : colors.surface.border,
                    borderRadius: borderRadius.md,
                  }}
                >
                  <AppText variant="body-lg">{release.title}</AppText>
                  <AppText variant="body-sm" color={colors.onSurface.variant}>
                    {release.artist} · {release.type}
                  </AppText>
                </Pressable>
              );
            })
          )}
          {fieldErrors.release ? <ErrorMessage message={fieldErrors.release} /> : null}
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="label-caps" color={colors.onSurface.variant}>
            Tipo de envío
          </AppText>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              label="Inmediato"
              variant={sendType === 'IMMEDIATE' ? 'primary' : 'secondary'}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                setRequestError(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              error={fieldErrors.scheduledAt}
            />
          ) : null}
        </View>

        <View style={{ gap: spacing.xs }}>
          <AppText variant="label-caps" color={colors.onSurface.variant}>
            Listas de destinatarios
          </AppText>
          {recipientLists.length === 0 ? (
            <EmptyState message="Necesitás crear una lista de destinatarios antes de crear una promo." />
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
                    isSubmitting
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
          label="Crear promo"
          loading={isSubmitting}
          disabled={releases.length === 0 || recipientLists.length === 0}
          onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

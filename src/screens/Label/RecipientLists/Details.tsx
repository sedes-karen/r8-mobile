import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal as RNModal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StaticScreenProps } from '@react-navigation/native';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { LabeledInput } from '../../../components/molecules/LabeledInput';
import { Modal } from '../../../components/molecules/Modal';
import { RecipientMemberRow } from '../../../components/molecules/RecipientMemberRow';
import { SearchField } from '../../../components/molecules/SearchField';
import { useRecipientListDetail } from '../../../features/recipients/useRecipientListDetail';
import { useManageMembers } from '../../../features/recipients/useManageMembers';
import type { RecipientListMember } from '../../../types/recipients';

type LabelRecipientListsDetailsScreenProps = StaticScreenProps<{ listId: string }>;

/**
 * Detalle de una lista de destinatarios.
 * Permite visualizar miembros, agregar nuevos contactos (por email o desde el pool) y quitar miembros.
 */
export function LabelRecipientListsDetailsScreen({ route }: LabelRecipientListsDetailsScreenProps) {
  const listId = route.params.listId;
  const state = useRecipientListDetail(listId);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'email' | 'pool'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  const members = state.status === 'success' ? state.data.members : [];

  const {
    isAdding,
    isRemoving,
    removingId,
    error: mutationError,
    clearError,
    pool,
    isPoolLoading,
    poolError,
    loadPool,
    addByEmail,
    addFromPool,
    removeMember,
  } = useManageMembers(listId, {
    existingMembers: members,
    onMutated: state.reload,
  });

  const isSubmitDisabled = isAdding || (addMode === 'pool' && !selectedPoolId);

  const confirmLabel = useMemo(() => {
    if (isAdding) {
      return 'Agregando...';
    }
    if (addMode === 'email') {
      return 'Agregar por email';
    }
    if (!selectedPoolId) {
      return 'Seleccioná un contacto';
    }
    return 'Agregar seleccionado';
  }, [isAdding, addMode, selectedPoolId]);

  const filteredPool = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (pool ?? []).filter((contact) => {
      if (!q) return true;
      return (
        contact.email.toLowerCase().includes(q) ||
        (contact.display_name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [pool, searchQuery]);

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando lista..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const { list } = state.data;

  const handleRemove = (member: RecipientListMember) => {
    if (isRemoving) {
      return;
    }

    Alert.alert(
      'Quitar destinatario',
      `¿Estás seguro de que querés quitar a ${member.display_name ?? member.email} de la lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Quitar',
          style: 'destructive',
          onPress: () => {
            removeMember(member.id);
          },
        },
      ],
    );
  };

  const handleOpenAddModal = () => {
    clearError();
    setEmailInput('');
    setSelectedPoolId(null);
    setSearchQuery('');
    setAddMode('email');
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    if (isAdding) {
      return;
    }
    setIsAddModalOpen(false);
    clearError();
  };

  const handleConfirmAdd = async () => {
    if (isSubmitDisabled) {
      return;
    }

    if (addMode === 'email') {
      const ok = await addByEmail(emailInput);
      if (ok) {
        setEmailInput('');
        setIsAddModalOpen(false);
      }
    } else {
      if (!selectedPoolId) {
        return;
      }
      const ok = await addFromPool(selectedPoolId);
      if (ok) {
        setSelectedPoolId(null);
        setIsAddModalOpen(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="headline-lg">{list.name}</AppText>
          <AppText variant="body-sm" color={colors.onSurface.variant}>
            {members.length === 1 ? '1 destinatario' : `${members.length} destinatarios`}
            {` · Creada el ${new Date(list.createdAt).toLocaleDateString()}`}
          </AppText>
        </View>

        {mutationError && !isAddModalOpen ? (
          <ErrorMessage message={mutationError} />
        ) : null}

        {members.length === 0 ? (
          <EmptyState message="Esta lista todavía no tiene destinatarios." />
        ) : (
          <View>
            {members.map((member) => (
              <RecipientMemberRow
                key={member.id}
                member={member}
                onRemove={isRemoving ? () => {} : () => handleRemove(member)}
                isRemoving={removingId === member.id}
              />
            ))}
          </View>
        )}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <Button
            label="Agregar destinatario"
            variant="secondary"
            disabled={isRemoving}
            onPress={handleOpenAddModal}
          />
          <Button label="Editar lista" variant="secondary" disabled onPress={() => {}} />
          <Button label="Cargar CSV" variant="secondary" disabled onPress={() => {}} />
        </View>
      </ScrollView>

      <RNModal
        visible={isAddModalOpen}
        transparent
        animationType="fade"
        onRequestClose={isAdding ? () => {} : handleCloseAddModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
        >
          <Modal
            title="Agregar destinatario"
            onClose={isAdding ? () => {} : handleCloseAddModal}
            onCancel={isAdding ? () => {} : handleCloseAddModal}
            onConfirm={isSubmitDisabled ? () => {} : handleConfirmAdd}
            confirmLabel={confirmLabel}
          >
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs }}>
              <Button
                label="Por email"
                variant={addMode === 'email' ? 'primary' : 'secondary'}
                disabled={isAdding}
                onPress={() => {
                  if (isAdding) return;
                  setAddMode('email');
                  clearError();
                }}
              />
              <Button
                label="Desde el pool"
                variant={addMode === 'pool' ? 'primary' : 'secondary'}
                disabled={isAdding}
                onPress={() => {
                  if (isAdding) return;
                  setAddMode('pool');
                  clearError();
                  if (!pool && !isPoolLoading) {
                    loadPool();
                  }
                }}
              />
            </View>

            {addMode === 'email' ? (
              <View style={{ gap: spacing.sm }}>
                <LabeledInput
                  label="Email del destinatario"
                  placeholder="persona@ejemplo.com"
                  value={emailInput}
                  onChangeText={(text) => {
                    setEmailInput(text);
                    if (mutationError) clearError();
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isAdding}
                  error={mutationError ?? undefined}
                />
              </View>
            ) : (
              <View style={{ gap: spacing.sm }}>
                <SearchField
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar en el pool..."
                  editable={!isAdding}
                />
                {isPoolLoading ? (
                  <ActivityIndicator color={colors.primary.default} style={{ marginVertical: spacing.md }} />
                ) : poolError ? (
                  <ErrorMessage message={poolError} />
                ) : (
                  <>
                    {!selectedPoolId && filteredPool.length > 0 ? (
                      <AppText variant="body-sm" color={colors.onSurface.variant}>
                        Seleccioná un contacto de la lista para agregarlo.
                      </AppText>
                    ) : null}
                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                      {filteredPool.length === 0 ? (
                        <AppText
                          variant="body-sm"
                          color={colors.onSurface.variant}
                          style={{ paddingVertical: spacing.sm }}
                        >
                          No se encontraron destinatarios en el pool.
                        </AppText>
                      ) : (
                        filteredPool.map((contact) => {
                          const isMember = members.some(
                            (m) =>
                              m.id === contact.id ||
                              m.email.toLowerCase().trim() === contact.email.toLowerCase().trim(),
                          );
                          const isSelected = selectedPoolId === contact.id;
                          return (
                            <Pressable
                              key={contact.id}
                              disabled={isMember || isAdding}
                              accessibilityRole="button"
                              accessibilityState={{
                                disabled: isMember || isAdding,
                                selected: isSelected,
                              }}
                              onPress={() => {
                                if (isMember || isAdding) return;
                                setSelectedPoolId(contact.id);
                                if (mutationError) clearError();
                              }}
                              style={{
                                paddingVertical: spacing.sm,
                                paddingHorizontal: spacing.sm,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.surface.border,
                                backgroundColor: isSelected
                                  ? colors.surface.containerHigh
                                  : 'transparent',
                                opacity: isMember ? 0.5 : 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <View style={{ flex: 1, marginRight: spacing.xs }}>
                                <AppText variant="body-lg">
                                  {contact.display_name ?? contact.email}
                                </AppText>
                                {contact.display_name ? (
                                  <AppText variant="body-sm" color={colors.onSurface.variant}>
                                    {contact.email}
                                  </AppText>
                                ) : null}
                              </View>
                              {isMember ? (
                                <AppText variant="label-micro" color={colors.onSurface.variant}>
                                  En lista
                                </AppText>
                              ) : isSelected ? (
                                <AppText variant="label-micro" color={colors.primary.default}>
                                  ✓ Seleccionado
                                </AppText>
                              ) : null}
                            </Pressable>
                          );
                        })
                      )}
                    </ScrollView>
                  </>
                )}
                {mutationError ? <ErrorMessage message={mutationError} /> : null}
              </View>
            )}
          </Modal>
        </View>
      </RNModal>
    </SafeAreaView>
  );
}


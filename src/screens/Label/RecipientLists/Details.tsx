import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StaticScreenProps } from '@react-navigation/native';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { RecipientMemberRow } from '../../../components/molecules/RecipientMemberRow';
import { useRecipientListDetail } from '../../../features/recipients/useRecipientListDetail';

type LabelRecipientListsDetailsScreenProps = StaticScreenProps<{ listId: string }>;

/**
 * Detalle de una lista de destinatarios — solo lectura.
 * El alta de destinatarios, la edición y la carga masiva quedan para la próxima entrega:
 * los botones están visibles pero deshabilitados, siguiendo el mismo criterio que List.
 */
export function LabelRecipientListsDetailsScreen({ route }: LabelRecipientListsDetailsScreenProps) {
  const state = useRecipientListDetail(route.params.listId);

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando lista..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const { list, members } = state.data;

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

        {members.length === 0 ? (
          <EmptyState message="Esta lista todavía no tiene destinatarios." />
        ) : (
          <View>
            {members.map((member) => (
              <RecipientMemberRow key={member.id} member={member} />
            ))}
          </View>
        )}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <Button label="Agregar destinatario" variant="secondary" disabled onPress={() => {}} />
          <Button label="Editar lista" variant="secondary" disabled onPress={() => {}} />
          <Button label="Cargar CSV" variant="secondary" disabled onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

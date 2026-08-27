import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { RecipientListRow } from '../../../components/molecules/RecipientListRow';
import { useRecipientLists } from '../../../features/recipients/useRecipientLists';

/**
 * Recipient Lists — solo lectura. "Nueva lista" y "Cargar CSV" quedan para el Equipo 5
 * (botones visibles, sin acción).
 */
export function LabelRecipientListsListScreen() {
  const state = useRecipientLists();

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando listas..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const { lists } = state.data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Listas de destinatarios</AppText>

        {lists.length === 0 ? (
          <EmptyState message="Todavía no creaste ninguna lista de destinatarios." />
        ) : (
          lists.map((list) => <RecipientListRow key={list.id} list={list} />)
        )}

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Nueva lista" variant="secondary" disabled onPress={() => {}} />
          <Button label="Cargar CSV" variant="secondary" disabled onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

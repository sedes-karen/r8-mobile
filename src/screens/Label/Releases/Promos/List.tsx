import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../../constants/design';
import { AppText } from '../../../../components/atoms/AppText';
import { Button } from '../../../../components/atoms/Button';
import { LoadingBlock } from '../../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../../components/molecules/EmptyState';
import { ErrorState } from '../../../../components/molecules/ErrorState';
import { PromoRow } from '../../../../components/molecules/PromoRow';
import { usePromosForLabel } from '../../../../features/promos/usePromosForLabel';

/** Promos lado label — solo lectura. "Nueva promo" queda para el Equipo 4 (botón sin acción). */
export function LabelReleasesPromosListScreen() {
  const state = usePromosForLabel();

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando promos..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Promos</AppText>

        {state.data.length === 0 ? (
          <EmptyState message="Todavía no enviaste ninguna promo." />
        ) : (
          state.data.map((promo) => <PromoRow key={promo.id} promo={promo} />)
        )}

        <Button label="Nueva promo" variant="secondary" disabled onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { ReleasesListContent } from '../../../components/organisms/ReleasesListContent';
import { useReleases } from '../../../features/releases/useReleases';

/** Releases del label — solo lectura. */
export function LabelReleasesListScreen() {
  const state = useReleases();

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando releases..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const releases = state.data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Releases</AppText>

        {releases.length === 0 ? (
          <EmptyState message="Todavía no creaste ningún release." />
        ) : (
          <ReleasesListContent releases={releases} />
        )}

        <Button label="Nuevo release" variant="secondary" disabled onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
}
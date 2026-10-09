import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LinkButton } from '../../../components/atoms/LinkButton';
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

        <LinkButton
          screen="New"
          params={{}}
          style={({ pressed }) => ({
            backgroundColor: colors.surface.containerHigh,
            opacity: pressed ? 0.7 : 1,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.lg,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
          })}
        >
          <AppText variant="title-md">Nuevo release</AppText>
        </LinkButton>
      </ScrollView>
    </SafeAreaView>
  );
}
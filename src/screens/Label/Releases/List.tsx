import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { useReleases } from '../../../features/releases/useReleases';
import type { ReleaseType } from '../../../types/releases';

const TYPE_LABEL: Record<ReleaseType, string> = {
  EP: 'EP',
  VA: 'VA',
  ALBUM: 'Álbum',
};

/**
 * Releases del label — solo lectura. Las filas usan un layout provisorio inline; el Equipo 4 las
 * reemplaza por sus dos componentes dedicados en el siguiente paso.
 */
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
          releases.map((release) => (
            <View
              key={release.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: colors.surface.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="body-lg" numberOfLines={1}>
                  {release.title}
                </AppText>
                <AppText variant="body-sm" color={colors.onSurface.variant}>
                  {release.artist}
                </AppText>
              </View>
              <AppText variant="body-sm" color={colors.onSurface.variant}>
                {TYPE_LABEL[release.type]}
                {' · '}
                {new Date(release.releaseDate).toLocaleDateString()}
              </AppText>
            </View>
          ))
        )}

        <Button label="Nuevo release" variant="secondary" disabled onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
}
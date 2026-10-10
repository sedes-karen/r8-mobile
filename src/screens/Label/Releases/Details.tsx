import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StaticScreenProps } from '@react-navigation/native';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { MetaDataRow } from '../../../components/molecules/MetaDataRow';
import { useReleaseDetail } from '../../../features/releases/useReleaseDetail';

type LabelReleasesDetailsScreenProps = StaticScreenProps<{ releaseId: string }>;

// La API manda la fecha como YYYY-MM-DD. No se pasa por `new Date()` porque en UTC-3
// mostraría el día anterior.
function formatReleaseDate(value: string | null | undefined): string {
  if (!value) return 'Sin fecha';
  const [year, month, day] = value.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

// La duración viene en segundos.
function formatDuration(seconds?: number | null): string {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
}

/**
 * Detalle de un release — solo lectura.
 */
export function LabelReleasesDetailsScreen({ route }: LabelReleasesDetailsScreenProps) {
  const state = useReleaseDetail(route.params.releaseId);

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando release..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const release = state.data;
  const tracks = [...release.tracks].sort((a, b) => a.trackNumber - b.trackNumber);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        {release.coverUrl ? (
          <Image
            source={{ uri: release.coverUrl }}
            style={{ width: '100%', aspectRatio: 1 }}
            resizeMode="cover"
          />
        ) : null}

        <AppText variant="headline-lg">{release.title}</AppText>

        <View>
          <MetaDataRow label="Artista" value={release.artist || 'Sin artista'} />
          <MetaDataRow label="Tipo" value={release.type} />
          <MetaDataRow label="Fecha" value={formatReleaseDate(release.releaseDate)} />
          {release.catalogNumber ? (
            <MetaDataRow label="Catálogo" value={release.catalogNumber} />
          ) : null}
          <MetaDataRow label="Estado" value={release.status} />
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="title-md">Tracks</AppText>
          {tracks.length === 0 ? (
            <EmptyState message="Este release todavía no tiene tracks." />
          ) : (
            tracks.map((track) => (
              <View
                key={track.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: spacing.xs,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.surface.border,
                }}
              >
                <AppText variant="body-lg">
                  {track.trackNumber}. {track.title}
                </AppText>
                <AppText variant="body-sm" color={colors.onSurface.variant}>
                  {formatDuration(track.duration)}
                </AppText>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
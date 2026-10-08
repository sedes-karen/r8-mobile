import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import type { ReleaseTrack } from '../../types/releases';
import type { TrackStatAction, TrackStatSummary } from '../../types/feedback/form';

type TrackStatsRowProps = {
  track: ReleaseTrack;
  stats: TrackStatSummary;
  /** Acción en curso para esta pista, para mostrar el spinner solo en el botón que la lanzó. */
  pendingAction: TrackStatAction | null;
  onPlay: () => void;
  onToggleLike: () => void;
  onDownload: () => void;
  disabled?: boolean;
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Fila de una pista con su consumo: cuántos plays lleva, si leaggusta al receptor y si la
 * descargó, más los botones que disparan cada PATCH. Es la versión "de carga" de `TrackRow` (esa
 * es solo para quitar de favoritos), porque acá hay tres acciones y dos contadores que mostrar.
 *
 * Sin reproductor: el proyecto no tiene librería de audio, así que registrar una reproducción es
 * una acción explícita del usuario en lugar de un evento del player.
 */
export function TrackStatsRow({
  track,
  stats,
  pendingAction,
  onPlay,
  onToggleLike,
  onDownload,
  disabled = false,
}: TrackStatsRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="body-lg" style={styles.title} numberOfLines={1}>
          {track.title}
        </AppText>
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {formatDuration(track.duration)}
        </AppText>
      </View>

      <AppText variant="body-sm" color={colors.onSurface.variant}>
        {`Reproducciones: ${stats.playCount}${stats.downloaded ? ' · Descargada' : ''}`}
      </AppText>

      <View style={styles.actions}>
        <Button
          label="+1 reproducción"
          variant="secondary"
          disabled={disabled}
          loading={pendingAction === 'play'}
          onPress={onPlay}
        />
        <Button
          label={stats.liked ? 'Quitar like' : 'Me gusta'}
          variant="secondary"
          disabled={disabled}
          loading={pendingAction === 'like'}
          onPress={onToggleLike}
        />
        <Button
          label="Descargar"
          variant="secondary"
          disabled={disabled}
          loading={pendingAction === 'download'}
          onPress={onDownload}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.container,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});

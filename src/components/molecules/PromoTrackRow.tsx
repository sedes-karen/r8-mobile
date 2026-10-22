import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

// --- Categoría: Tipos ---

type PromoTrackRowProps = {
  trackNumber: number;
  title: string;
  duration?: number | null;
  isActive?: boolean;
  isLiked?: boolean;
  onSelectTrack: () => void;
  onToggleLike?: () => void;
  onDownload?: () => void;
};

// --- Categoría: Utilidades ---

function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// --- Categoría: Componente ---

export function PromoTrackRow({
  trackNumber,
  title,
  duration,
  isActive = false,
  isLiked = false,
  onSelectTrack,
  onToggleLike,
  onDownload,
}: PromoTrackRowProps) {
  return (
    <Pressable
      onPress={onSelectTrack}
      style={[styles.container, isActive && styles.containerActive]}
    >
      <AppText variant="body-sm" color={colors.onSurface.variant}>
        {trackNumber}.
      </AppText>

      <AppText variant="body-lg" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>

      <AppText variant="body-sm" color={colors.onSurface.variant}>
        {formatDuration(duration)}
      </AppText>

      {onDownload ? (
        <Pressable onPress={onDownload} style={styles.actionButton} hitSlop={8}>
          <AppText variant="body-sm">⤓</AppText>
        </Pressable>
      ) : null}

      {onToggleLike ? (
        <Pressable onPress={onToggleLike} style={styles.actionButton} hitSlop={8}>
          <AppText variant="body-sm" color={isLiked ? colors.error.default : colors.onSurface.variant}>
            {isLiked ? '❤️' : '🤍'}
          </AppText>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

// --- Categoría: Estilos ---

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  containerActive: {
    backgroundColor: colors.surface.containerHigh,
  },
  title: {
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: spacing.xs,
  },
});

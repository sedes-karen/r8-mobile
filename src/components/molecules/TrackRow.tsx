import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';

type TrackRowProps = {
  title: string;
  duration: number;
  removing: boolean;
  onUnlike: () => void;
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/** Fila de un track dentro de un release, en la pantalla de Liked Tracks. */
export function TrackRow({ title, duration, removing, onUnlike }: TrackRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', gap: spacing.sm }}>
        <AppText variant="body-lg" style={{ flex: 1 }} numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {formatDuration(duration)}
        </AppText>
      </View>
      <Button label="Quitar" variant="secondary" loading={removing} onPress={onUnlike} />
    </View>
  );
}

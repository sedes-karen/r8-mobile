import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import type { ReleaseListItem, ReleaseType } from '../../types/releases';

const TYPE_LABEL: Record<ReleaseType, string> = {
  EP: 'EP',
  VA: 'VA',
  ALBUM: 'Álbum',
};

type ReleasesListContentProps = {
  releases: ReleaseListItem[];
};

/**
 * Lista de releases del label — filas con título, artista, tipo y fecha.
 * Solo presentación: la screen decide qué hacer al tocar una fila.
 */
export function ReleasesListContent({ releases }: ReleasesListContentProps) {
  return (
    <View>
      {releases.map((release) => (
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
      ))}
    </View>
  );
}

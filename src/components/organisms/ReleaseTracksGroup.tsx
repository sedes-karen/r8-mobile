import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { TrackRow } from '../molecules/TrackRow';
import type { LikedTracksReleaseItem } from '../../types/feedback/likedTracks';

type ReleaseTracksGroupProps = {
  release: LikedTracksReleaseItem;
  removingTrackId: string | null;
  onUnlikeTrack: (trackId: string) => void;
};

/**
 * Header de release + sus tracks likeados — el DTO de liked-tracks viene agrupado por release,
 * así que este organismo refleja esa forma real en vez de aplanar la lista.
 */
export function ReleaseTracksGroup({ release, removingTrackId, onUnlikeTrack }: ReleaseTracksGroupProps) {
  return (
    <View style={{ gap: spacing.xs }}>
      <View>
        <AppText variant="title-md">{release.title}</AppText>
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {release.artistName}
        </AppText>
      </View>
      {release.tracks.map((track) => (
        <TrackRow
          key={track.trackId}
          title={track.title}
          duration={track.duration}
          removing={removingTrackId === track.trackId}
          onUnlike={() => onUnlikeTrack(track.trackId)}
        />
      ))}
    </View>
  );
}

import { useEffect, useState } from 'react';
import { fetchLikedTracks, setTrackLiked } from '../../services/api/likedTracksApi';
import { useAsyncData, type AsyncState } from '../../hooks/useAsyncData';
import type { LikedTracksReleaseItem } from '../../types/feedback/likedTracks';

type UnlikeState = {
  removingTrackId: string | null;
  message: string | null;
};

/**
 * Liked Tracks (Equipo 3) — carga la lista y expone unlikeTrack con update optimista: saca el
 * track de la UI al toque, y si el PATCH falla lo vuelve a traer de la fuente real en vez de
 * intentar "revertir" el estado local a mano.
 */
export function useLikedTracks() {
  const fetchState = useAsyncData(fetchLikedTracks);
  const [items, setItems] = useState<LikedTracksReleaseItem[] | null>(null);
  const [unlike, setUnlike] = useState<UnlikeState>({ removingTrackId: null, message: null });

  useEffect(() => {
    if (fetchState.status === 'success') {
      setItems(fetchState.data);
    }
  }, [fetchState.status, fetchState.status === 'success' ? fetchState.data : null]);

  async function unlikeTrack(releaseId: string, feedbackId: string, trackId: string) {
    setUnlike({ removingTrackId: trackId, message: null });
    const previous = items;

    setItems(
      (current) =>
        current
          ?.map((release) =>
            release.releaseId === releaseId
              ? { ...release, tracks: release.tracks.filter((track) => track.trackId !== trackId) }
              : release,
          )
          .filter((release) => release.tracks.length > 0) ?? current,
    );

    try {
      await setTrackLiked(releaseId, feedbackId, trackId, false);
      setUnlike({ removingTrackId: null, message: null });
    } catch (error) {
      // Rollback: no confiamos en el estado local post-error, volvemos a pedir la lista real.
      setItems(previous);
      setUnlike({
        removingTrackId: null,
        message: error instanceof Error ? error.message : 'No se pudo quitar de favoritos',
      });
    }
  }

  const status: AsyncState<LikedTracksReleaseItem[]>['status'] = items ? 'success' : fetchState.status;

  return {
    status,
    message: fetchState.status === 'error' ? fetchState.message : undefined,
    items: items ?? [],
    unlikeError: unlike.message,
    removingTrackId: unlike.removingTrackId,
    unlikeTrack,
    reload: fetchState.reload,
  };
}

import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { LikedTracksReleaseItem } from '../../types/feedback/likedTracks';

/**
 * GET /feedback/liked-tracks — solo el caso artista autenticado (Bearer) en este batch.
 * El flujo guest con ?token= queda para el Equipo 3 (evita meternos en deep links, que hoy no
 * están resueltos a nivel de navegación).
 */
export async function fetchLikedTracks(): Promise<LikedTracksReleaseItem[]> {
  const response = await apiClient('/feedback/liked-tracks');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar los tracks favoritos');
  }
  return response.json() as Promise<LikedTracksReleaseItem[]>;
}

/**
 * PATCH /releases/:releaseId/feedback/:feedbackId/track-stats/liked — el único write de todo
 * este batch. `feedbackId` es el propio feedback del receptor para ese release (viene en el
 * item de fetchLikedTracks, no hace falta pedirlo aparte).
 */
export async function setTrackLiked(
  releaseId: string,
  feedbackId: string,
  trackId: string,
  liked: boolean,
): Promise<void> {
  const response = await apiClient(`/releases/${releaseId}/feedback/${feedbackId}/track-stats/liked`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ track_id: trackId, liked }),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo actualizar el favorito');
  }
}

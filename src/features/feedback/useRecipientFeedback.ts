import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthUser } from '../auth/info';
import { fetchUsersMe } from '../../services/api/userApi';
import { getPromoDetail } from '../../services/api/promos';
import { fetchReleaseDetail } from '../../services/api/releasesApi';
import { addTrackPlayStats, ensureFeedback, markTracksDownloaded } from '../../services/api/feedbackApi';
import { setTrackLiked } from '../../services/api/likedTracksApi';
import { useAsyncData, type AsyncState } from '../../hooks/useAsyncData';
import type {
  FeedbackEntity,
  FeedbackTrackStat,
  TrackStatAction,
  TrackStatMap,
  TrackStatSummary,
} from '../../types/feedback/form';
import type { PromoDetail } from '../../types/promo';
import type { ReleaseTrack } from '../../types/releases';

export type RecipientFeedbackData = {
  promo: PromoDetail;
  tracks: ReleaseTrack[];
  feedback: FeedbackEntity;
  /** `userId` de la sesión, necesario tanto para el ensure como para el batch de descargas. */
  userId: string;
};

type PendingAction = { trackId: string; action: TrackStatAction };

export const EMPTY_TRACK_STATS: TrackStatSummary = {
  playCount: 0,
  liked: false,
  downloaded: false,
};

/**
 * Convierte los `trackStats` snake_case de la entidad al resumen que pinta la pantalla, e
 * incluye los tracks sin estadística para que la fila no tenga que decidir el valor por defecto.
 */
function toTrackStatMap(tracks: ReleaseTrack[], trackStats: FeedbackTrackStat[]): TrackStatMap {
  const byTrack = new Map(trackStats.map((stat) => [stat.track_id, stat]));
  return Object.fromEntries(
    tracks.map((track) => {
      const stat = byTrack.get(track.id);
      return [
        track.id,
        {
          playCount: stat?.play_count ?? 0,
          liked: stat?.liked ?? false,
          downloaded: stat?.downloaded ?? false,
        },
      ];
    }),
  );
}

/**
 * Datos y acciones del feedback de una promo, para la pantalla Artist/Promos/Feedback.
 *
 * El orden de carga importa: la promo trae el release slim (sin pistas), así que primero se pide
 * `GET /promos/:id` y con el `release.id` que devuelve se pide `GET /releases/:releaseId`. Recién
 * con el release en mano se puede correr el "ensure" del feedback, que además dice si el
 * formulario sigue editable (`rating === null` = primera entrega, la única que el servidor acepta).
 */
export function useRecipientFeedback(promoId: string | undefined) {
  const user = useAuthUser();
  const [stats, setStats] = useState<TrackStatMap | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const resolveUserId = useCallback(async (): Promise<string> => {
    if (user?.id) return user.id;
    // El perfil del contexto no siempre trae `id` (el tipo local lo marca opcional), así que
    // antes de rendirnos preguntamos a la API en vez de romper el ensure con un 403.
    const profile = await fetchUsersMe();
    if (!profile.id) {
      throw new Error('No pudimos identificar a qué usuario registrar este feedback');
    }
    return profile.id;
  }, [user?.id]);

  const load = useCallback(async (): Promise<RecipientFeedbackData> => {
    if (!promoId) {
      throw new Error('No se recibió el identificador de la promo');
    }

    const promo = await getPromoDetail(promoId);
    const release = await fetchReleaseDetail(promo.release.id);
    const userId = await resolveUserId();
    const feedback = await ensureFeedback(release.id, userId);

    return { promo, tracks: release.tracks ?? [], feedback, userId };
  }, [promoId, resolveUserId]);

  const state: AsyncState<RecipientFeedbackData> & { reload: () => void } = useAsyncData(load);

  // `useAsyncData` no depende del promoId (solo recarga con `reload`), así que si la pantalla se
  // reutiliza para otra promo hay que pedir los datos de nuevo.
  const loadedPromoId = useRef(promoId);
  useEffect(() => {
    if (loadedPromoId.current === promoId) return;
    loadedPromoId.current = promoId;
    state.reload();
  }, [promoId, state.reload]);

  // Espejo del servidor: mientras no llegue la respuesta, `stats` es null y la pantalla muestra
  // loading en vez de ceros que después "corrigen" solos.
  const serverData = state.status === 'success' ? state.data : null;
  useEffect(() => {
    if (!serverData) return;
    setStats(toTrackStatMap(serverData.tracks, serverData.feedback.trackStats ?? []));
  }, [serverData]);

  /**
   * Aplica una acción de estadística con update optimista y vuelve al estado anterior si el
   * request falla — no dejamos el contador mentiroso en pantalla (mismo criterio que
   * useLikedTracks).
   */
  async function runStatAction(
    action: TrackStatAction,
    trackId: string,
    apply: (current: TrackStatMap) => TrackStatMap,
    request: () => Promise<unknown>,
    failureMessage: string,
  ) {
    const previous = stats;
    setStatsError(null);
    setPending({ trackId, action });
    setStats((current) => (current ? apply(current) : current));

    try {
      await request();
      setPending(null);
    } catch (error) {
      setStats(previous);
      setPending(null);
      setStatsError(error instanceof Error ? error.message : failureMessage);
    }
  }

  const registerPlay = (trackId: string) => {
    if (!serverData) return;
    return runStatAction(
      'play',
      trackId,
      (current) => ({
        ...current,
        [trackId]: { ...current[trackId], playCount: current[trackId].playCount + 1 },
      }),
      () =>
        addTrackPlayStats(serverData.feedback.releaseId, serverData.feedback.id, [
          { track_id: trackId, play_count: 1 },
        ]),
      'No se pudo registrar la reproducción',
    );
  };

  const toggleLike = (trackId: string) => {
    if (!serverData) return;
    return runStatAction(
      'like',
      trackId,
      (current) => ({ ...current, [trackId]: { ...current[trackId], liked: !current[trackId].liked } }),
      () =>
        setTrackLiked(
          serverData.feedback.releaseId,
          serverData.feedback.id,
          trackId,
          !stats?.[trackId].liked,
        ),
      'No se pudo actualizar el favorito',
    );
  };

  const registerDownload = (trackId: string) => {
    if (!serverData) return;
    return runStatAction(
      'download',
      trackId,
      (current) => ({ ...current, [trackId]: { ...current[trackId], downloaded: true } }),
      () =>
        markTracksDownloaded([
          { user_id: serverData.userId, release_id: serverData.feedback.releaseId, tracks: [trackId] },
        ]),
      'No se pudo registrar la descarga',
    );
  };

  return {
    ...state,
    promo: serverData?.promo ?? null,
    tracks: serverData?.tracks ?? [],
    feedback: serverData?.feedback ?? null,
    /** El servidor solo acepta el formulario mientras `rating` sea null. */
    canSubmitFeedback: serverData ? serverData.feedback.rating === null : false,
    trackStats: stats,
    statsPending: pending,
    statsError,
    registerPlay,
    toggleLike,
    registerDownload,
  };
}

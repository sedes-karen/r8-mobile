import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type {
  DownloadedBatchItem,
  FeedbackEntity,
  TrackStatsDelta,
  UpdateFeedbackBody,
} from '../../types/feedback/form';

/**
 * Feedback del receptor (scope `/releases/:releaseId/feedback`, ver DTOs §8.2). El "me gusta" de
 * una pista NO vive acá: ya está implementado en likedTracksApi (mismo endpoint), así que las
 * pantallas lo importan de ahí para no duplicar el write.
 */

function feedbackPath(releaseId: string, feedbackId: string): string {
  return `/releases/${encodeURIComponent(releaseId)}/feedback/${encodeURIComponent(feedbackId)}`;
}

/**
 * POST /releases/:releaseId/feedback — "ensure": registra al receptor o recupera el feedback que
 * ya tenía para ese release. Responde **200** si existía y **201** si lo creó, pero en los dos
 * casos devuelve la misma entidad, que es lo que permite saber si el formulario sigue editable
 * (`rating === null`).
 *
 * `userId` debe ser el `users.id` del contacto autenticado (Bearer o `?token=`); si no coincide
 * con la sesión, la API responde 403.
 */
export async function ensureFeedback(
  releaseId: string,
  userId: string,
  recipientToken?: string,
): Promise<FeedbackEntity> {
  const response = await apiClient(`/releases/${encodeURIComponent(releaseId)}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
    recipientToken,
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo registrar tu feedback para esta promo');
  }
  return response.json() as Promise<FeedbackEntity>;
}

/**
 * PATCH /releases/:releaseId/feedback/:feedbackId — envío del formulario del receptor.
 *
 * Ojo: la API **solo persiste si el `rating` anterior era `null`** (primera entrega). Reintentar
 * el envío no actualiza nada y devuelve 200 igual, así que la pantalla consulta el feedback con
 * el ensure antes de habilitar el botón en vez de confiar en un error del servidor.
 */
export async function submitFeedback(
  releaseId: string,
  feedbackId: string,
  body: UpdateFeedbackBody,
  recipientToken?: string,
): Promise<FeedbackEntity> {
  const response = await apiClient(feedbackPath(releaseId, feedbackId), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    recipientToken,
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo enviar el feedback');
  }
  return response.json() as Promise<FeedbackEntity>;
}

/**
 * PATCH /releases/:releaseId/feedback/:feedbackId/track-stats — suma deltas de reproducción. El
 * cuerpo es un **array**, no un objeto: se pueden mandar varias pistas en el mismo request.
 */
export async function addTrackPlayStats(
  releaseId: string,
  feedbackId: string,
  deltas: TrackStatsDelta[],
  recipientToken?: string,
): Promise<FeedbackEntity> {
  const response = await apiClient(`${feedbackPath(releaseId, feedbackId)}/track-stats`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deltas),
    recipientToken,
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo registrar la reproducción');
  }
  return response.json() as Promise<FeedbackEntity>;
}

/**
 * PATCH /feedback/track-stats/downloaded — batch de descargas. No es por release: es el endpoint
 * global del receptor, así que el body lleva `user_id` y `release_id` por cada item. Es
 * idempotente, reenviar el mismo track no duplica la descarga.
 */
export async function markTracksDownloaded(batch: DownloadedBatchItem[]): Promise<FeedbackEntity[]> {
  const response = await apiClient('/feedback/track-stats/downloaded', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batch),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo registrar la descarga');
  }
  return response.json() as Promise<FeedbackEntity[]>;
}

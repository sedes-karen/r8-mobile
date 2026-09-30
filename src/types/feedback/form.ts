/**
 * Feedback del receptor para un release: la entidad que devuelve `POST/PATCH
 * /releases/:releaseId/feedback` (ver DTOs_Y_CUERPOS_HTTP.md §8.2). Solo se tipa lo que
 * consume la pantalla Artist/Promos/Feedback: los campos de gestión del label (`status`,
 * `internalNotes`, `labelResponse`, `sentiment`, `category`, `priority`) quedan fuera de este
 * flujo.
 *
 * Ojo con `trackStats`: viene en snake_case, al revés que el resto de la entidad.
 */
export type FeedbackTrackStat = {
  track_id: string;
  play_count: number;
  listening_time: number;
  liked: boolean;
  downloaded: boolean;
};

export type FeedbackEntity = {
  id: string;
  releaseId: string;
  userId: string;
  /** `null` = el receptor todavía no envió el formulario (única ventana editable). */
  rating: number | null;
  comment: string | null;
  willPlay: boolean | null;
  supported: boolean;
  trackStats: FeedbackTrackStat[];
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Cuerpo de `PATCH /releases/:releaseId/feedback/:feedbackId` (UpdateFeedbackDto).
 * La API los declara todos opcionales; acá van siempre los cuatro porque la pantalla exige
 * calificar, comentar intención de reproducción y supportive antes de enviar.
 */
export type UpdateFeedbackBody = {
  rating: number;
  comment: string | null;
  willPlay: boolean;
  supported: boolean;
};

/**
 * Cuerpo de `PATCH /releases/:releaseId/feedback/:feedbackId/track-stats`: es un ARRAY de deltas
 * de reproducción, no un objeto.
 *
 * `listening_time` es opcional a propósito — la app todavía no reproduce audio (no hay librería
 * de audio en el proyecto), así que no hay segundos escuchados que informar y mandar 0
 * falsearía el `averageListeningTime` de `/feedback/analytics`.
 */
export type TrackStatsDelta = {
  track_id: string;
  play_count: number;
  listening_time?: number;
};

/**
 * Cuerpo de `PATCH /feedback/track-stats/downloaded` (SetTracksDownloadedBatchItemDto): también
 * un array, y es idempotente — se puede reenviar el mismo track sin duplicar la descarga.
 */
export type DownloadedBatchItem = {
  user_id: string;
  release_id: string;
  tracks: string[];
};

/**
 * Estado del formulario de feedback. Vive acá (y no en el hook) porque es el contrato que la
 * pantalla le pasa al organismo `FeedbackForm`: los componentes no deberían importar de
 * `features/` (ATOMIC_DESIGN.md §2.3).
 */
export type FeedbackFormValues = {
  rating: number | null;
  comment: string;
  willPlay: boolean | null;
  supported: boolean | null;
};

export type FeedbackFormField = 'rating' | 'comment' | 'willPlay' | 'supported';

export type FeedbackFormErrors = Partial<Record<FeedbackFormField, string>>;

/**
 * Resumen por pista que pinta la pantalla de estadísticas. Sale de aplanar los `trackStats`
 * snake_case de la entidad a algo con lo que se pueda trabajar directo en la fila.
 */
export type TrackStatSummary = {
  playCount: number;
  liked: boolean;
  downloaded: boolean;
};

export type TrackStatMap = Record<string, TrackStatSummary>;

export type TrackStatAction = 'play' | 'like' | 'download';

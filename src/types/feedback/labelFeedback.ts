import type { FeedbackTrackStat } from './form';

/**
 * Item de `GET /feedback` (ámbito label, ver DTOs_Y_CUERPOS_HTTP.md §8.1). Es la entidad cruda,
 * distinta del listado por release (§8.2): no trae el `recipient` anidado, así que la fila no puede
 * mostrar quién lo mandó. El join `release` es opcional según la consulta.
 *
 * Archivo aparte de `form.ts` (Equipo 3) para no pisar los tipos del flujo receptor: los campos
 * de gestión del label (`status`, `priority`, etc.) solo existen en esta vista.
 */
export type LabelFeedbackItem = {
  id: string;
  releaseId: string;
  userId: string;
  /** `null` = el receptor abrió la promo pero todavía no envió el formulario. */
  rating: number | null;
  comment: string | null;
  willPlay: boolean | null;
  supported: boolean;
  status: string;
  trackStats: FeedbackTrackStat[];
  createdAt: string;
  release?: { title: string };
};

/** `GET /feedback` devuelve un objeto, no un array: el listado viene en `feedback`. */
export type LabelFeedbackListResponse = {
  feedback: LabelFeedbackItem[];
  total: number;
};

/** `GET /feedback/pending-count`. */
export type PendingFeedbackCount = {
  count: number;
};

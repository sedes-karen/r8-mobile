/**
 * Estados de promo según la API — ver docs/DTOs_Y_CUERPOS_HTTP.md §6. No existe `DELETED`
 * (el delete es físico).
 */
export type PromoStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'SENDING'
  | 'SENT'
  | 'CANCELLED'
  | 'FAILED'
  | 'EXPIRED';

/**
 * Lista de destinatarios tal como viene resumida en las respuestas de promo
 * (verificado en stage 2026-08-27 para GET /promos/for-label).
 */
export type PromoRecipientList = {
  id: string;
  name: string;
  recipientCount: number;
  hasNonValidMailRecipients: boolean;
};

/**
 * Respuesta real de GET /promos/for-label — verificado contra stage 2026-08-27 (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §6). Solo se tipa lo que consume la pantalla de listado.
 */
export type PromoForLabelItem = {
  id: string;
  labelId: string;
  releaseId: string;
  release: {
    id: string;
    title: string;
    catalogNumber: string | null;
    artistName: string | null;
    coverUrl: string;
  };
  scheduledAt: string | null;
  sentAt: string | null;
  status: PromoStatus;
  isActive: boolean;
  feedbackCount: number;
  averageRating: number | null;
};

/**
 * GET /promos/:promoId — detalle slim de una promo (ver docs/DTOs_Y_CUERPOS_HTTP.md §6).
 * No incluye `labelId`, `releaseId`, `recipientListIds` ni `release.tracks`: para audio hay
 * que pedir GET /releases/:releaseId por separado.
 */
export type PromoDetail = {
  id: string;
  status: PromoStatus;
  isActive: boolean;
  useCuratedDb: boolean;
  scheduledAt: string | null;
  /**
   * Fecha de envío efectiva. El resumen del DTO de detalle no la lista explícitamente
   * (aunque GET /promos/for-label sí la trae): se tipa opcional y la UI maneja la ausencia.
   */
  sentAt?: string | null;
  recipientLists: PromoRecipientList[];
  /** Resumen de stats: no figura garantizado en el DTO de detalle; la pantalla la muestra solo si viene. */
  feedbackCount?: number;
  averageRating?: number | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  release: {
    id: string;
    title: string;
    artistName: string | null;
    labelName: string | null;
    catalogNumber: string | null;
    artwork: string | null;
    /** ISO — en respuestas de release suele ser `YYYY-MM-DD`. */
    releaseDate: string | null;
    type: string;
    notes: string | null;
  };
};

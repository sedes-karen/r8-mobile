import type { PromoDetail, PromoStatus } from '../promo';

export type { PromoStatus };

/**
 * Lista de destinatarios tal como viene resumida en las respuestas de promo (verificado en
 * stage 2026-08-27 para GET /promos/for-label; GET /promos/:promoId la trae embebida con la
 * misma forma — docs/DTOs_Y_CUERPOS_HTTP.md §6).
 */
export type PromoRecipientList = {
  id: string;
  name: string;
  recipientCount?: number;
  hasNonValidMailRecipients?: boolean;
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
 * Detalle de promo para el label — compone el `PromoDetail` de Equipo 3 (src/types/promo.ts)
 * con los campos del DTO de detalle (docs/DTOs_Y_CUERPOS_HTTP.md §6) que ese tipo no declara.
 * Todos los campos extra son opcionales: así `PromoDetail` es asignable sin casts y la
 * pantalla tolera la ausencia (p. ej. `recipientLists ?? []`).
 */
export type PromoDetailForLabel = PromoDetail & {
  /** Listas de destinatarios embebidas en el detalle. */
  recipientLists?: PromoRecipientList[];
  useCuratedDb?: boolean;
  /** Motivo del último fallo, si `status` es FAILED. */
  errorMessage?: string | null;
  /**
   * Fecha de envío efectiva. El resumen del DTO de detalle no la lista explícitamente
   * (aunque GET /promos/for-label sí la trae): se tipa opcional y la UI maneja la ausencia.
   */
  sentAt?: string | null;
  /** Stats de resultado: no figuran garantizadas en el DTO de detalle; la pantalla las muestra solo si vienen. */
  feedbackCount?: number;
  averageRating?: number | null;
};

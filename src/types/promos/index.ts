/**
 * Respuesta real de GET /promos/for-label — verificado contra stage 2026-08-27 (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §6). Solo se tipa lo que consume esta pantalla de listado.
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
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED' | 'FAILED' | 'EXPIRED';
  isActive: boolean;
  feedbackCount: number;
  averageRating: number | null;
};

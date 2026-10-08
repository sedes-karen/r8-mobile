/**
 * Ítem de la bandeja del receptor/artista (resumen `GET /promos/inbox`).
 * Solo se tipa lo que consume la pantalla Player de promos (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §6 → PromoInboxItemDto).
 */
export type PromoStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED' | 'FAILED' | 'EXPIRED';

export type PromoInboxItem = {
  id: string;
  labelId: string;
  labelName: string | null;
  status: PromoStatus;
  isActive: boolean;
  sentAt: string | null;
  expiresAt: string | null;
  hasFeedback: boolean;
  release: {
    id: string;
    title: string;
  };
};

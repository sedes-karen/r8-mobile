
/**
 * Ítem de la bandeja del receptor/artista (resumen `GET /promos/inbox`).
 * Solo se tipa lo que consume la pantalla Player de promos.
 */
export type PromoStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'SENDING'
  | 'SENT'
  | 'CANCELLED'
  | 'FAILED'
  | 'EXPIRED';

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

/**
 * Detalle de promo (`GET /promos/:id`, ver DTOs_Y_CUERPOS_HTTP.md §6 → PromoDetailDto).
 *
 * Es un DTO slim a propósito: no trae `labelId`/`releaseId` planos ni `release.tracks`, así que
 * para los tracks hay que pedir aparte `GET /releases/:releaseId`. El `release.id` sí viene, que
 * es lo que usa la pantalla de feedback para recién ahí pedir el release completo.
 */
export type PromoDetail = {
  id: string;
  status: PromoStatus;
  isActive: boolean;
  useCuratedDb: boolean;
  scheduledAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  errorMessage?: string | null;
  recipientLists?: Array<{ id: string; name: string; recipientCount?: number }>;
  release: {
    id: string;
    title: string;
    artistName: string | null;
    labelName: string | null;
    catalogNumber: string | null;
    artwork: string | null;
    releaseDate: string | null;
    type: string | null;
    notes: string | null;
  };
};

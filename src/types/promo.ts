
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

export type PromoDetail = {
  id: string;
  status: PromoStatus;
  isActive: boolean;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  release: {
    id: string;
    title: string;
    artistName: string | null;
    labelName: string | null;
    catalogNumber: string | null;
    artwork: string | null;
    releaseDate: string | null;
    type: string;
    notes: string | null;
  };
};


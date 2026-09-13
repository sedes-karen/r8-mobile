// Tipos para GET /promos/:id — solo lo que necesita la pantalla de detalle.
// La respuesta slim no incluye tracks; esos se piden por separado a /releases/:id.

export type PromoDetailRelease = {
  id: string;
  title: string;
  artistName: string | null;
  catalogNumber: string | null;
  releaseDate: string | null;
  type: 'EP' | 'VA' | 'ALBUM';
  notes: string | null;
};

export type PromoDetail = {
  id: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED' | 'FAILED' | 'EXPIRED';
  isActive: boolean;
  scheduledAt: string | null;
  sentAt: string | null;
  expiresAt: string | null;
  release: PromoDetailRelease;
};

/**
 * Cuerpo de PATCH /promos/:id — `UpdatePromoDto`, todos los campos opcionales
 * (docs/DTOs_Y_CUERPOS_HTTP.md §6). El servidor solo pisa los que llegan en el body.
 */
export type UpdatePromoBody = {
  /** Fecha de envío en formato ISO. */
  scheduledAt?: string;
  /** Incluye la base curada de R8 (default `false` en el servidor). */
  useCuratedDb?: boolean;
  /** `SCHEDULED` exige `scheduledAt` junto (misma regla que CreatePromoDto). */
  sendType?: 'IMMEDIATE' | 'SCHEDULED';
  /** Reemplaza el set completo de listas de destinatarios de la promo. */
  recipientListIds?: string[];
  /** Fecha de expiración en formato ISO. */
  expiresAt?: string;
};

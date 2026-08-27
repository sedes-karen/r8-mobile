/**
 * Respuesta real de GET /recipient-lists — coincide con lo documentado en
 * docs/DTOs_Y_CUERPOS_HTTP.md §7 (a diferencia de Analytics/Promos-for-label, este endpoint ya
 * estaba bien documentado, verificado igual contra stage 2026-08-27).
 */
export type RecipientListSummary = {
  id: string;
  labelId: string;
  name: string;
  createdAt: string;
  recipientCount: number;
  hasNonValidMailRecipients: boolean;
};

export type RecipientListsIndexResponse = {
  lists: RecipientListSummary[];
  total: number;
  deliverySummary: {
    totalUniqueEmails: number;
    deliveredUniqueEmails: number;
    unsubscribedUniqueEmails: number;
  };
};

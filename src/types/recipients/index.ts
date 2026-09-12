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

/**
 * Respuesta de `GET /recipient-lists/:listId` — verificada contra stage 2026-09-12.
 * La doc (§7 de DTOs_Y_CUERPOS_HTTP.md) solo dice "Lista" sin detallar el cuerpo.
 *
 * Se tipea a propósito solo el subconjunto que consumimos: la respuesta real además trae
 * `members`, `promos` y `label` embebidos. Para los miembros usamos el endpoint dedicado
 * (`/recipients`), que es el único que devuelve `id` y `status` por destinatario — el `members`
 * de acá viene sin esos dos campos.
 */
export type RecipientListDetail = {
  id: string;
  labelId: string;
  name: string;
  createdAt: string;
};

/**
 * Un destinatario dentro de una lista — `GET /recipient-lists/:listId/recipients`, que devuelve
 * un array plano (no envuelto en un objeto). Verificado contra stage 2026-09-12.
 *
 * Ojo con `display_name`: este endpoint lo devuelve en snake_case, a diferencia del `members`
 * embebido en el detalle de la lista, que usa `displayName`. No es un typo de este archivo.
 *
 * `status` se deja como `string` porque el único valor observado en stage fue `'VALID'` y no hay
 * enum documentado: cualquier valor distinto se trata como mail no válido.
 */
export type RecipientListMember = {
  id: string;
  email: string;
  status: string;
  display_name: string | null;
};

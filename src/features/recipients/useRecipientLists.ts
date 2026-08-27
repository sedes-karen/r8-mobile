import { fetchRecipientLists } from '../../services/api/recipientListsApi';
import { useAsyncData } from '../../hooks/useAsyncData';

/** Listas de destinatarios (lectura) — GET /recipient-lists. */
export function useRecipientLists() {
  return useAsyncData(fetchRecipientLists);
}

import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { RecipientListsIndexResponse } from '../../types/recipients';

/** GET /recipient-lists — requiere sesión label (Bearer). Sin paginado en este batch. */
export async function fetchRecipientLists(): Promise<RecipientListsIndexResponse> {
  const response = await apiClient('/recipient-lists');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las listas de destinatarios');
  }
  return response.json() as Promise<RecipientListsIndexResponse>;
}

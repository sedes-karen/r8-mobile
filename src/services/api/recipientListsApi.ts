import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type {
  RecipientListDetail,
  RecipientListMember,
  RecipientListsIndexResponse,
} from '../../types/recipients';

/** GET /recipient-lists — requiere sesión label (Bearer). Sin paginado en este batch. */
export async function fetchRecipientLists(): Promise<RecipientListsIndexResponse> {
  const response = await apiClient('/recipient-lists');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar las listas de destinatarios');
  }
  return response.json() as Promise<RecipientListsIndexResponse>;
}

/** GET /recipient-lists/:listId — datos de una lista puntual (sin sus miembros). */
export async function fetchRecipientListById(listId: string): Promise<RecipientListDetail> {
  const response = await apiClient(`/recipient-lists/${listId}`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar la lista de destinatarios');
  }
  return response.json() as Promise<RecipientListDetail>;
}

/**
 * GET /recipient-lists/:listId/recipients — miembros de la lista.
 * Devuelve un array plano, no un objeto con metadata alrededor.
 */
export async function fetchRecipientListMembers(listId: string): Promise<RecipientListMember[]> {
  const response = await apiClient(`/recipient-lists/${listId}/recipients`);
  if (!response.ok) {
    throw await readApiError(response, 'No se pudieron cargar los destinatarios de la lista');
  }
  return response.json() as Promise<RecipientListMember[]>;
}

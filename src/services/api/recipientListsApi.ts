import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type {
  AddRecipientResponse,
  RecipientListDetail,
  RecipientListMember,
  RecipientListsIndexResponse,
  RecipientPoolItem,
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

export type RecipientBatchItem = {
  email: string;
  display_name?: string;
};

export type AddRecipientsBatchResponse = {
  added: RecipientListMember[];
  skipped: number;
};

/**
 * POST /recipient-lists/:listId/recipients/batch
 * Agrega varios destinatarios a una lista.
 */
export async function addRecipientsBatch(
  listId: string,
  recipients: RecipientBatchItem[],
): Promise<AddRecipientsBatchResponse> {
  const response = await apiClient(
    `/recipient-lists/${encodeURIComponent(listId)}/recipients/batch`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipients }),
    },
  );

  if (!response.ok) {
    throw await readApiError(
      response,
      'No se pudieron agregar los destinatarios',
    );
  }

  return response.json() as Promise<AddRecipientsBatchResponse>;
}

/**
 * GET /recipient-lists/recipients — pool de contactos del sello.
 * Devuelve un array plano de destinatarios disponibles.
 */
export async function fetchRecipientPool(): Promise<RecipientPoolItem[]> {
  const response = await apiClient('/recipient-lists/recipients');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el pool de destinatarios');
  }
  return response.json() as Promise<RecipientPoolItem[]>;
}

/**
 * POST /recipient-lists/:listId/recipients — agrega un destinatario por email.
 * Envía exactamente `{ email }`.
 */
export async function addRecipientToListByEmail(
  listId: string,
  email: string,
): Promise<AddRecipientResponse> {
  const response = await apiClient(`/recipient-lists/${encodeURIComponent(listId)}/recipients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo agregar el destinatario a la lista');
  }
  return response.json() as Promise<AddRecipientResponse>;
}

/**
 * POST /recipient-lists/:listId/recipients — agrega un destinatario por su ID (ya existente en el pool).
 * Envía exactamente `{ recipientId }`.
 */
export async function addRecipientToListById(
  listId: string,
  recipientId: string,
): Promise<AddRecipientResponse> {
  const response = await apiClient(`/recipient-lists/${encodeURIComponent(listId)}/recipients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipientId }),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo agregar el destinatario a la lista');
  }
  return response.json() as Promise<AddRecipientResponse>;
}

/**
 * DELETE /recipient-lists/:listId/recipients/:recipientId — quita un destinatario de la lista.
 * Responde 204 No Content en caso exitoso (sin cuerpo JSON).
 */
export async function removeRecipientFromList(
  listId: string,
  recipientId: string,
): Promise<void> {
  const response = await apiClient(
    `/recipient-lists/${encodeURIComponent(listId)}/recipients/${encodeURIComponent(recipientId)}`,
    {
      method: 'DELETE',
    },
  );
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo quitar el destinatario de la lista');
  }
}


/**
 * PUT /recipient-lists/:listId — renombra la lista.
 * No se lee el cuerpo de la respuesta: la doc solo dice "Actualizada" sin detallar la forma, y la
 * pantalla vuelve a pedir la lista igual al salir de la edición.
 */
export async function updateRecipientList(listId: string, name: string): Promise<void> {
  const response = await apiClient(`/recipient-lists/${encodeURIComponent(listId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo actualizar la lista');
  }
}

/**
 * DELETE /recipient-lists/:listId — elimina la lista (204 sin cuerpo).
 * El 409 significa que la lista está en uso por una promo: se traduce a un mensaje entendible en
 * vez de mostrar el error genérico de la API. Va antes del `!response.ok` porque 409 también es
 * "no ok".
 */
export async function deleteRecipientList(listId: string): Promise<void> {
  const response = await apiClient(`/recipient-lists/${encodeURIComponent(listId)}`, {
    method: 'DELETE',
  });
  if (response.status === 409) {
    throw new Error('No se puede eliminar: la lista está siendo usada por una promo.');
  }
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo eliminar la lista');
  }
}

import { fetchRecipientListById, fetchRecipientListMembers } from '../../services/api/recipientListsApi';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { RecipientListDetail, RecipientListMember } from '../../types/recipients';

export type RecipientListDetailData = {
  list: RecipientListDetail;
  members: RecipientListMember[];
};

/**
 * Detalle de una lista + sus miembros (lectura). Son dos endpoints separados porque el detalle
 * no trae `id` ni `status` por miembro, y los necesitamos para marcar los mails no válidos.
 * Van en paralelo: no dependen entre sí.
 *
 * Asume que `listId` no cambia mientras la pantalla está montada (cada detalle es un push nuevo
 * en el stack): `useAsyncData` solo vuelve a pedir datos vía `reload()`, no observa argumentos.
 */
export function useRecipientListDetail(listId: string) {
  return useAsyncData<RecipientListDetailData>(async () => {
    const [list, members] = await Promise.all([
      fetchRecipientListById(listId),
      fetchRecipientListMembers(listId),
    ]);
    return { list, members };
  });
}

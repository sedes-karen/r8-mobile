import { useAuthUser } from '../auth/info';
import { fetchPromosForLabel } from '../../services/api/promosApi';
import { useAsyncData } from '../../hooks/useAsyncData';

/**
 * Promos del label (lectura) — GET /promos/for-label. El labelId sale de GET /users/me
 * (labels[0].id, ya resuelto en el contexto de auth), no hace falta pedirlo aparte.
 */
export function usePromosForLabel() {
  const user = useAuthUser();
  const labelId = user?.labels?.[0]?.id;

  return useAsyncData(() =>
    labelId
      ? fetchPromosForLabel(labelId)
      : Promise.reject(new Error('No se encontró un label activo para este usuario')),
  );
}

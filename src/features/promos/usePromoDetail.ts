import { fetchPromoById } from '../../services/api/promosApi';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { PromoDetail } from '../../types/promos';

/**
 * Detalle de una promo del label (sólo lectura) — GET /promos/:promoId.
 * Asume que `promoId` no cambia mientras la pantalla está montada (cada detalle es un push
 * nuevo en el stack): `useAsyncData` solo vuelve a pedir datos vía `reload()`, no observa argumentos.
 */
export function usePromoDetail(promoId: string) {
  return useAsyncData<PromoDetail>(() => fetchPromoById(promoId));
}

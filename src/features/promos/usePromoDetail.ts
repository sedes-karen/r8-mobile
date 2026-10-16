import { usePromoDetails } from './usePromoDetails';
import type { AsyncState } from '../../hooks/useAsyncData';
import type { PromoDetailForLabel } from '../../types/promos';

/**
 * Detalle de una promo del label (sólo lectura) — GET /promos/:promoId.
 * Delega en `usePromoDetails` de Equipo 3 (mismo ciclo de vida y manejo de errores) y solo
 * rebranda el retorno con los campos extra del DTO. Asume que `promoId` no cambia mientras la
 * pantalla está montada (cada detalle es un push nuevo en el stack).
 */
export function usePromoDetail(
  promoId: string,
): AsyncState<PromoDetailForLabel> & { reload: () => void } {
  return usePromoDetails(promoId);
}

import { getPromoDetails } from '../../services/api/promos';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { PromoDetail } from '../../types/promo';

/** Detalle de una promo (sólo lectura). Si no llega promoId, se activa ErrorState */
export function usePromoDetails(promoId?: string) {
  return useAsyncData<PromoDetail>(() =>
    promoId
      ? getPromoDetails(promoId)
      : Promise.reject(new Error('No se encontró la promo.')),
  );
}

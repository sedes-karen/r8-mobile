import { useEffect, useState } from 'react';
import { getPromoDetails } from '../../services/api/promos';
import type { PromoDetail } from '../../types/promo';

export function usePromoDetails(promoId: string) {
  const [promo, setPromo] = useState<PromoDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPromoDetails(promoId)
      .then(setPromo)
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar la promo.',
        );
      });
  }, [promoId]);

  return { promo, error };
}

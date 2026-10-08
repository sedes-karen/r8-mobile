import { getPromosInbox, getPromosPendingCount } from '../../services/api/promos';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { PromoInboxItem } from '../../types/promo';

export type ArtistPromosData = {
  inbox: PromoInboxItem[];
  pendingCount: number;
};

/** Bandeja del artista para la pantalla Player. Expone recarga manual para el pull-to-refresh. */
export function useArtistPromos() {
  return useAsyncData(async (): Promise<ArtistPromosData> => {
    const [inbox, pending] = await Promise.all([getPromosInbox(), getPromosPendingCount()]);
    return { inbox, pendingCount: pending.count };
  });
}

import { getPromosInbox, getPromosPendingCount } from '../../services/api/promos';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { PromoInboxItem } from '../../types/promo';

/** Hook para obtener promos del artista - usa GET /promos/inbox y GET /promos/inbox/pending-count. */
export function useArtistPromos() {
  return useAsyncData<{
    inbox: PromoInboxItem[];
    pendingCount: number;
  }>(async () => {
    const [inbox, pending] = await Promise.all([
      getPromosInbox(),
      getPromosPendingCount(),
    ]);
    return { inbox, pendingCount: pending.count };
  });
}
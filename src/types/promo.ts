export type PromoDetail = {
  id: string;
  release: {
    id: string;
    title: string;
    artistName: string | null;
    labelName: string | null;
    catalogNumber: string | null;
    artwork: unknown;
    releaseDate: string | null;
    type: string | null;
    notes: string | null;
  };
  scheduledAt: string | null;
  status: PromoStatus;
  isActive: boolean;
  useCuratedDb: boolean;
  recipientLists: unknown[];
  createdAt: string;
  updatedAt: string;
  errorMessage?: string | null;
};
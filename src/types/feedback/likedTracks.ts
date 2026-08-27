/**
 * Respuesta real de GET /feedback/liked-tracks — verificado contra stage 2026-08-27 (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §8.1). Ojo: no trae un booleano `liked` por track — todo lo que
 * aparece acá ya está likeado (es la lista de favoritos, no un catálogo toggleable). El único
 * write con sentido en esta pantalla es "quitar de favoritos".
 */
export type LikedTrack = {
  trackId: string;
  title: string;
  duration: number;
  url: string;
  downloaded: boolean;
  audioSize: number;
};

export type LikedTracksReleaseItem = {
  feedbackId: string;
  releaseId: string;
  labelId: string;
  labelName: string;
  title: string;
  artistName: string;
  artwork: string;
  downloadsEnabled: boolean;
  promoExpired: boolean;
  tracks: LikedTrack[];
};

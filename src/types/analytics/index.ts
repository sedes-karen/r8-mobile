/**
 * Respuesta real de GET /feedback/analytics — verificado contra stage 2026-08-27 (ver
 * docs/DTOs_Y_CUERPOS_HTTP.md §8.1). Solo se tipa lo que esta pantalla consume (overall +
 * byRelease); trends/funnelCounts quedan fuera del alcance de este batch (necesitarían
 * gráficos, es una pantalla en sí misma) pero se documentan en el doc por si las suma otro
 * equipo más adelante.
 */
export type LabelAnalytics = {
  overall: {
    totalFeedback: number;
    averageRating: number;
    supportRate: number;
    responseRate: number;
    recentFeedback: number;
  };
  byRelease: Array<{
    releaseId: string;
    releaseTitle: string;
    feedbackCount: number;
    averageRating: number;
    supportRate: number;
  }>;
};

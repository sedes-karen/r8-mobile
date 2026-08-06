/** Configuración HTTP del curso. */
export const apiConfig = {
  baseUrl: (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, ''),
  /** Mientras sea true, releasesApi devuelve mock local (sin stage). */
  useMock: true,
  mockDelayMs: 800,
} as const;

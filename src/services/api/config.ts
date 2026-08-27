/** Configuración HTTP del curso. Por defecto pega contra Stage real (ver .env committeado). */
export const apiConfig = {
  baseUrl: (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, ''),
  /**
   * Mientras sea true, releasesApi devuelve mock local en vez de pegarle a Stage.
   * Default: false. Se activa por variable de entorno, no hardcodeado, para que nadie
   * lo deje prendido sin querer en `main` — si lo necesitás localmente, ponelo en tu
   * propio .env.local (gitignored), no en el .env committeado.
   */
  useMock: process.env.EXPO_PUBLIC_USE_MOCK === 'true',
  mockDelayMs: 800,
} as const;

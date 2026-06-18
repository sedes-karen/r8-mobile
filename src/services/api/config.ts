/** Cuando el curso habilite stage, cambiar BASE_URL y USE_MOCK. */
export const apiConfig = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  useMock: true,
  /** Demora artificial para ver spinners */
  mockDelayMs: 800,
} as const;

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_USE_MOCK_API?: string;
    EXPO_PUBLIC_MOCK_DELAY_MS?: string;
  };
};

const DEFAULT_MOCK_DELAY_MS = 800;
const rawMockDelayMs = Number(process.env.EXPO_PUBLIC_MOCK_DELAY_MS);

function resolveMockDelayMs() {
  if (Number.isFinite(rawMockDelayMs) && rawMockDelayMs >= 0) {
    return rawMockDelayMs;
  }

  return DEFAULT_MOCK_DELAY_MS;
}

export const apiConfig = {
  // URL base del stage de r8-api. Ejemplo: https://stage-api.r8.example.com
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  // Por defecto usamos mocks para que las pantallas avancen sin depender de stage.
  useMock: process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false',
  // Delay artificial para probar estados loading en desarrollo.
  mockDelayMs: resolveMockDelayMs(),
} as const;

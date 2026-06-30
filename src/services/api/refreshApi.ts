import { apiConfig } from './config';
import { setAccessToken } from './tokenStore';

function refreshUrl(): string {
  if (!apiConfig.baseUrl) {
    throw new Error('Falta EXPO_PUBLIC_API_URL');
  }
  return `${apiConfig.baseUrl}/auth/refresh`;
}

/**
 * Renueva el accessToken usando la cookie httpOnly de refresh (POST /auth/refresh).
 * En React Native puede requerir librería de cookies en producción; credentials: 'include' es el contrato del API.
 */
export async function attemptRefresh(): Promise<boolean> {
  try {
    const response = await fetch(refreshUrl(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: '{}',
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { accessToken?: string };
    if (typeof data.accessToken === 'string' && data.accessToken.length > 0) {
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

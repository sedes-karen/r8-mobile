import { apiConfig } from './config';
import { getAccessToken } from './tokenStore';
import { attemptRefresh } from './refreshApi';

export type ApiRequestInit = RequestInit & {
  /** Rutas públicas: login, register, health. */
  skipAuth?: boolean;
  /** Query `?token=` para flujos guest (Equipo 3). */
  recipientToken?: string;
  /** Interno: evita bucle infinito tras un refresh. */
  __retriedAfterRefresh?: boolean;
};

function buildUrl(path: string, recipientToken?: string): string {
  if (!apiConfig.baseUrl) {
    throw new Error('Falta EXPO_PUBLIC_API_URL');
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = `${apiConfig.baseUrl}${normalizedPath}`;
  if (!recipientToken) {
    return base;
  }
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}token=${encodeURIComponent(recipientToken)}`;
}

async function doFetch(path: string, init: ApiRequestInit): Promise<Response> {
  const { skipAuth, recipientToken, headers, ...rest } = init;
  const mergedHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (!skipAuth && token) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  return fetch(buildUrl(path, recipientToken), {
    ...rest,
    headers: mergedHeaders,
  });
}

/**
 * Cliente HTTP único del curso.
 * Ante 401 en rutas autenticadas intenta POST /auth/refresh una vez y reintenta la petición.
 */
export async function apiClient(path: string, init: ApiRequestInit = {}): Promise<Response> {
  let response = await doFetch(path, init);

  if (
    response.status === 401 &&
    !init.skipAuth &&
    !init.__retriedAfterRefresh
  ) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      response = await doFetch(path, { ...init, __retriedAfterRefresh: true });
    }
  }

  return response;
}

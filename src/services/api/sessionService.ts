import type { AppRole, AvailableRoles, UserMeProfile } from '../../types/auth';
import { login, type LoginBody } from './authApi';
import { attemptRefresh } from './refreshApi';
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStore';
import { fetchUsersMe } from './userApi';

export type EstablishedSession = {
  accessToken: string;
  role: AppRole;
  user: UserMeProfile;
};

export function deriveAvailableRoles(user: UserMeProfile): AvailableRoles {
  const hasLabel = Boolean(user.labels && user.labels.length > 0);
  const hasArtist = Boolean(user.artist);
  return { label: hasLabel, artist: hasArtist };
}

/**
 * Elige el stack de navegación según el perfil devuelto por GET /users/me.
 */
export function resolveNavigationRole(
  user: UserMeProfile,
  preferred?: AppRole,
): AppRole {
  const available = deriveAvailableRoles(user);
  if (preferred && available[preferred]) {
    return preferred;
  }
  if (available.label) {
    return 'label';
  }
  if (available.artist) {
    return 'artist';
  }
  throw new Error('El usuario no tiene rol label ni artist en stage');
}

/**
 * Guarda el accessToken y revalida la sesión contra GET /users/me.
 * Si el token no es aceptado, limpia el store y propaga el error.
 */
export async function establishSession(accessToken: string): Promise<EstablishedSession> {
  setAccessToken(accessToken);
  try {
    const user = await fetchUsersMe();
    const role = resolveNavigationRole(user);
    return { accessToken: getAccessToken() ?? accessToken, role, user };
  } catch (error) {
    clearAccessToken();
    throw error;
  }
}

/**
 * Login completo: credenciales → accessToken → revalidación GET /users/me.
 */
export async function loginAndEstablishSession(
  body: LoginBody,
): Promise<EstablishedSession> {
  const loginResponse = await login(body);
  return establishSession(loginResponse.accessToken);
}

/**
 * Revalida sesión con el token ya guardado (p. ej. al abrir la app / splash futuro).
 * Si GET /users/me devuelve 401, intenta POST /auth/refresh y reintenta una vez.
 */
export async function revalidateStoredSession(): Promise<EstablishedSession | null> {
  if (!getAccessToken()) {
    const refreshed = await attemptRefresh();
    if (!refreshed) {
      return null;
    }
  }

  try {
    const user = await fetchUsersMe();
    const token = getAccessToken();
    if (!token) {
      return null;
    }
    const role = resolveNavigationRole(user);
    return { accessToken: token, role, user };
  } catch {
    const refreshed = await attemptRefresh();
    if (!refreshed) {
      clearAccessToken();
      return null;
    }
    try {
      const user = await fetchUsersMe();
      const token = getAccessToken();
      if (!token) {
        return null;
      }
      const role = resolveNavigationRole(user);
      return { accessToken: token, role, user };
    } catch {
      clearAccessToken();
      return null;
    }
  }
}

export function clearSession(): void {
  clearAccessToken();
}

import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { UserMeProfile } from '../../types/auth';

/**
 * GET /users/me — requiere Bearer válido.
 * Usado para revalidar sesión tras login o al restaurar token guardado.
 */
export async function fetchUsersMe(): Promise<UserMeProfile> {
  const response = await apiClient('/users/me');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo validar la sesión');
  }
  return response.json() as Promise<UserMeProfile>;
}

/**
 * POST /auth/validate — alternativa explícita de validación del JWT (mismo criterio que el web).
 */
export async function validateAccessToken(): Promise<unknown> {
  const response = await apiClient('/auth/validate', { method: 'POST' });
  if (!response.ok) {
    throw await readApiError(response, 'Token inválido');
  }
  return response.json();
}

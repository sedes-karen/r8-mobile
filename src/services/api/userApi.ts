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

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  message: string;
};

/**
 * POST /users/me/change-password — requiere Bearer válido.
 * El servidor revoca el refresh token: hay que volver a loguearse después.
 */
export async function changePassword(
  data: ChangePasswordInput,
): Promise<ChangePasswordResponse> {
  const response = await apiClient('/users/me/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cambiar la contraseña');
  }

  return response.json() as Promise<ChangePasswordResponse>;
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

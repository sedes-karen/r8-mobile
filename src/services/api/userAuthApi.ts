import { readApiError } from './apiErrors';
import { apiClient } from './apiClient';
import type { AppRole } from '../../types/auth';

export type RegisterUserBody = {
  email: string;
  password: string;
  role: AppRole;
  labelName?: string;
  artistName?: string;
  firstName?: string;
  lastName?: string;
};

export type RegisterUserResponse = {
  success: boolean;
  requiresEmailVerification: boolean;
  email: string;
};

export type VerifyEmailResponse = {
  success: boolean;
  accessToken: string;
};

export type ResetPasswordBody = {
  email: string;
  pin: string;
  newPassword: string;
  confirmPassword: string;
};

export type MessageResponse = {
  message: string;
  accessToken?: string;
};

async function postJson<T>(path: string, body: unknown, includeCookies = false): Promise<T> {
  const response = await apiClient(path, {
    method: 'POST',
    skipAuth: true,
    ...(includeCookies ? { credentials: 'include' as const } : {}),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await readApiError(response, 'No se pudo completar la solicitud');
  }

  return response.json() as Promise<T>;
}

/** Alta pública: la sesión se crea recién después de verificar el PIN recibido por email. */
export function registerUser(body: RegisterUserBody): Promise<RegisterUserResponse> {
  return postJson('/users/register', body);
}

/** Confirma el PIN de registro y obtiene el access token inicial. */
export function verifyUserEmail(email: string, pin: string): Promise<VerifyEmailResponse> {
  return postJson('/users/verify-email', { email, pin }, true);
}

/** Reenvío del PIN; la respuesta del API no revela si el correo tiene una cuenta pendiente. */
export function resendEmailVerification(email: string): Promise<MessageResponse> {
  return postJson('/users/resend-verification', { email });
}

/** Solicita el código de recuperación con respuesta genérica para proteger la privacidad. */
export function requestPasswordReset(email: string): Promise<MessageResponse> {
  return postJson('/users/password/request-reset', { email });
}

/** Reemplaza la contraseña después de validar el PIN de recuperación. */
export function resetPassword(body: ResetPasswordBody): Promise<MessageResponse> {
  return postJson('/users/password/reset', body);
}

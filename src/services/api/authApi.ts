import { apiConfig } from './config';
import { readApiError } from './apiErrors';

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  accessToken: string;
  user?: unknown;
};

function loginUrl(): string {
  if (!apiConfig.baseUrl) {
    throw new Error('Falta EXPO_PUBLIC_API_URL');
  }
  return `${apiConfig.baseUrl}/auth/login`;
}

/**
 * POST /auth/login — sin Bearer; envía credentials para que el API setee cookie de refresh.
 */
export async function login(body: LoginBody): Promise<LoginResponse> {
  const response = await fetch(loginUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await readApiError(response, 'Login failed');
  }

  const data = (await response.json()) as LoginResponse;
  if (!data.accessToken) {
    throw new Error('Login succeeded but accessToken is missing');
  }
  return data;
}

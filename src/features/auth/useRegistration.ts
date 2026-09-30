import { useState } from 'react';
import { useAuthActions } from './info';
import { establishSession } from '../../services/api/sessionService';
import {
  registerUser,
  resendEmailVerification,
  verifyUserEmail,
  type RegisterUserBody,
} from '../../services/api/userAuthApi';
import type { AppRole } from '../../types/auth';

export function useRegistration() {
  const { applySession } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (body: RegisterUserBody): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(body);
      if (!response.requiresEmailVerification) {
        throw new Error('El registro no inició la verificación del correo.');
      }
      return response.email || body.email;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo crear la cuenta.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (email: string, pin: string, role: AppRole): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyUserEmail(email, pin);
      if (!response.accessToken) {
        throw new Error('La verificación no devolvió una sesión válida.');
      }
      const session = await establishSession(response.accessToken, role);
      applySession(session.accessToken, session.role, session.user);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo verificar el correo.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resend = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resendEmailVerification(email);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo reenviar el código.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, register, verify, resend };
}

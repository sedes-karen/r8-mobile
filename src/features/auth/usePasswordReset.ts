import { useState } from 'react';
import { establishSession } from '../../services/api/sessionService';
import {
  requestPasswordReset,
  resetPassword,
  type ResetPasswordBody,
} from '../../services/api/userAuthApi';
import { useAuthActions } from './info';

export function usePasswordReset() {
  const { applySession } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const requestCode = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await requestPasswordReset(email);
      setSuccessMessage('Si el correo está registrado, enviamos un código.');
      return true;
    } catch {
      setError('No se pudo solicitar el código.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (body: ResetPasswordBody): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    let passwordWasReset = false;
    try {
      const response = await resetPassword(body);
      if (!response.accessToken) {
        throw new Error('La respuesta no incluyó un token de acceso.');
      }

      passwordWasReset = true;
      const session = await establishSession(response.accessToken);
      applySession(session.accessToken, session.role, session.user);
      return true;
    } catch {
      setError(
        passwordWasReset
          ? 'La contraseña se actualizó, pero no se pudo iniciar la sesión. Ingresá con la nueva contraseña.'
          : 'No se pudo cambiar la contraseña.',
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, successMessage, requestCode, submitReset };
}

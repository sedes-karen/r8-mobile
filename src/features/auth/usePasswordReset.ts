import { useState } from 'react';
import {
  requestPasswordReset,
  resetPassword,
  type ResetPasswordBody,
} from '../../services/api/userAuthApi';

export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const requestCode = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await requestPasswordReset(email);
      setSuccessMessage('Si existe una cuenta con ese correo, enviamos un código de verificación.');
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo solicitar el código.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (body: ResetPasswordBody): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await resetPassword(body);
      setSuccessMessage('La contraseña se actualizó correctamente. Ya podés iniciar sesión.');
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo restablecer la contraseña.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, successMessage, requestCode, submitReset };
}

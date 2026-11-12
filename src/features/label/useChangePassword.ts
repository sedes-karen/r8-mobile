import { useCallback, useState } from 'react';
import { changePassword } from '../../services/api/userApi';

/**
 * Cambio de contraseña — POST /users/me/change-password.
 * `submit` resuelve true si el servidor respondió 200, false si no (ver `error`).
 * El endpoint revoca el refresh token, por eso el caller debe cerrar sesión.
 */
export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await changePassword({ currentPassword, newPassword });
        return true;
      } catch (caught: unknown) {
        setError(caught instanceof Error ? caught.message : 'No se pudo cambiar la contraseña');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { submit, changePassword: submit, loading, error };
}

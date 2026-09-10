import { useCallback, useState } from 'react';

/**
 * STUB TEMPORAL — implementación real a cargo de (POST /users/me/change-password).
 * Firma acordada: resuelve true si el cambio fue exitoso, false si no, y expone loading/error.
 */
export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    async (_currentPassword: string, _newPassword: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLoading(false);
      return true;
    },
    [],
  );

  return { changePassword, loading, error };
}

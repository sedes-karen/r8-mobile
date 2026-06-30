import { useCallback, useState } from 'react';
import { loginAndEstablishSession } from '../../services/api/sessionService';
import { useAuthActions } from './info';

/**
 * Hook para la pantalla Login (Clase 4 — los alumnos lo conectan al formulario).
 * Orquesta: POST /auth/login → establishSession → GET /users/me → applySession.
 */
export function useLogin() {
  const { applySession } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const session = await loginAndEstablishSession({ email, password });
        applySession(session.accessToken, session.role, session.user);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error de login');
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  return { submit, loading, error };
}

import { useCallback, useState } from 'react';
import type { UpdateLabelProfileInput } from '../../types/label';

/**
 * STUB TEMPORAL — implementación real a cargo de (PUT /labels/me).
 * Firma acordada: resuelve true si se guardó bien, false si no, y expone loading/error.
 */
export function useUpdateLabelProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (_input: UpdateLabelProfileInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);
    return true;
  }, []);

  return { submit, loading, error };
}

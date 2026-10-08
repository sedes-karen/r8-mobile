import { useCallback, useState } from 'react';

/**
 * STUB TEMPORAL — implementación real a cargo de (presign → PUT upload → confirm).
 * Firma acordada: recibe la URI del asset y su contentType, resuelve true si el upload+confirm
 * terminó bien, false si no, y expone loading/error.
 */
export function useLabelImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (_uri: string, _contentType: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLoading(false);
      return true;
    },
    [],
  );

  return { uploadImage, loading, error };
}

import { useCallback, useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

/**
 * Hook base de "cargar algo al montar, exponer loading/error/success" — se repite igual en las
 * 5 pantallas de lectura de este batch (Perfil Artista, Analytics, Liked Tracks, Promos label,
 * Recipient Lists), así que vive acá una sola vez en vez de reescribirse 5 veces. No decide cómo
 * renderizar cada estado — eso lo hace cada screen con LoadingBlock/ErrorState/EmptyState.
 */
export function useAsyncData<T>(fetchFn: () => Promise<T>): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    fetchFn()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', message: error instanceof Error ? error.message : 'Error inesperado' });
        }
      });

    return () => {
      cancelled = true;
    };
    // fetchFn se pasa como closure nueva en cada render a propósito (evita depender de useCallback
    // en cada caller); reloadToken es el único disparador real de refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { ...state, reload };
}

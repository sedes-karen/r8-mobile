import { useCallback, useEffect, useState } from 'react';
import { fetchReleases } from '../../services/api/releasesApi';
import type { ReleaseListItem } from '../../types/releases/release';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ReleaseListItem[] };

export function useReleases() {
  const [state, setState] = useState<State>({
    status: 'loading',
  });

  const load = useCallback(async () => {
    setState({ status: 'loading' });

    try {
      const data = await fetchReleases();

      if (data.length === 0) {
        setState({ status: 'empty' });
        return;
      }

      setState({
        status: 'success',
        data,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error desconocido';

      setState({
        status: 'error',
        message,
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    state,
    reload: load,
  };
}
import { useCallback, useEffect, useState } from 'react';
import { fetchReleaseById } from '../../services/api/releasesApi'; 
import type { ReleaseListItem } from '../../types/releases'; 

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ReleaseListItem };

export function useReleaseDetail(id: string | null | undefined) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    if (!id) {
      setState({ status: 'empty' });
      return;
    }

    setState({ status: 'loading' });
    try {
      const data = await fetchReleaseById(id);
      
      if (!data) {
        setState({ status: 'empty' });
      } else {
        setState({ status: 'success', data });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido';
      setState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
}
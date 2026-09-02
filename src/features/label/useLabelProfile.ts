import { useEffect, useState } from 'react';
import type { LabelProfile } from '../../types/label';

export type StubAsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

/**
 * STUB TEMPORAL — implementación real a cargo de (GET /labels/me).
 * Firma acordada para que Edit/View compilen en paralelo.
 */
export function useLabelProfile() {
  const [state, setState] = useState<StubAsyncState<LabelProfile>>({ status: 'loading' });

  useEffect(() => {
    setState({
      status: 'success',
      data: {
        id: '',
        userId: '',
        name: null,
        description: null,
        profileImagePath: null,
        profileImageUrl: null,
        bandcampUrl: null,
        soundcloudUrl: null,
        instagramUrl: null,
        twitterUrl: null,
        createdAt: '',
        updatedAt: '',
      },
    });
  }, []);

  return { ...state, reload: () => setState({ status: 'loading' }) };
}

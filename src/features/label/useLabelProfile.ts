import { fetchLabelMe } from '../../services/api/labelsApi';
import { useAsyncData } from '../../hooks/useAsyncData';

/** Perfil del label (lectura) — GET /labels/me. */
export function useLabelProfile() {
  return useAsyncData(fetchLabelMe);
}
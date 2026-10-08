import { apiClient } from './apiClient';
import { readApiError } from './apiErrors';
import type { LabelProfile } from '../../types/label';

/**
 * GET /labels/me — requiere sesión label (Bearer). Ya trae profileImageUrl resuelto, no
 * hace falta el call aparte a /labels/me/profile-image para una pantalla de solo lectura.
 * TODO(Equipo 2 / Juani): ampliar acá el PUT /labels/me y el flujo profile-image (subida) en edición.
 */
export async function fetchLabelMe(): Promise<LabelProfile> {
  const response = await apiClient('/labels/me');
  if (!response.ok) {
    throw await readApiError(response, 'No se pudo cargar el perfil del label');
  }
  return response.json() as Promise<LabelProfile>;
}

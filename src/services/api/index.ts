/**
 * Punto de entrada de la capa HTTP del curso.
 * Las pantallas no importan desde acá directamente: usan hooks en features/.
 */
export { apiConfig } from './config';
export { apiClient } from './apiClient';
export { login } from './authApi';
export { fetchReleases } from './releasesApi';
export {
  clearSession,
  establishSession,
  loginAndEstablishSession,
  revalidateStoredSession,
  resolveNavigationRole,
} from './sessionService';
export { fetchUsersMe } from './userApi';

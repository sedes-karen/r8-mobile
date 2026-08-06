import { createContext, PropsWithChildren, useContext, useState } from 'react';
import type { AppRole, UserMeProfile } from '../../types/auth';
import { clearSession } from '../../services/api/sessionService';
import { setAccessToken } from '../../services/api/tokenStore';

export type AuthInfo =
  | { isAuthenticated: false }
  | { isAuthenticated: true; role: AppRole };

const defaultAuthInfo: AuthInfo = { isAuthenticated: false };

type AuthContextValue = {
  authInfo: AuthInfo;
  /** Perfil devuelto por GET /users/me tras login o revalidación. */
  user: UserMeProfile | null;
  /** Solo desarrollo: entra a un stack sin llamar al API. */
  loginDev: (role: AppRole) => void;
  logout: () => void;
  /**
   * Actualiza contexto tras loginAndEstablishSession / revalidateStoredSession.
   * No llamar desde pantallas: usar useLogin o bootstrap futuro.
   */
  applySession: (accessToken: string, role: AppRole, user: UserMeProfile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('AuthInfoProvider is missing');
  }
  return ctx;
}

export function AuthInfoProvider(props: PropsWithChildren) {
  const [authInfo, setAuthInfo] = useState<AuthInfo>(defaultAuthInfo);
  const [user, setUser] = useState<UserMeProfile | null>(null);

  const loginDev = (role: AppRole) => {
    setUser(null);
    setAuthInfo({ isAuthenticated: true, role });
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setAuthInfo({ isAuthenticated: false });
  };

  const applySession = (accessToken: string, role: AppRole, profile: UserMeProfile) => {
    setAccessToken(accessToken);
    setUser(profile);
    setAuthInfo({ isAuthenticated: true, role });
  };

  return (
    <AuthContext.Provider value={{ authInfo, user, loginDev, logout, applySession }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthInfo(): AuthInfo {
  return useAuthContext().authInfo;
}

export function useAuthUser(): UserMeProfile | null {
  return useAuthContext().user;
}

export function useAuthActions() {
  const { loginDev, logout, applySession } = useAuthContext();
  return { loginDev, logout, applySession };
}

export function useIsAuthenticated() {
  return useAuthInfo().isAuthenticated;
}

export function useIsNotAuthenticated() {
  return !useIsAuthenticated();
}

export function useIsArtist() {
  const info = useAuthInfo();
  return info.isAuthenticated && info.role === 'artist';
}

export function useIsLabel() {
  const info = useAuthInfo();
  return info.isAuthenticated && info.role === 'label';
}

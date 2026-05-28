import { createContext, PropsWithChildren, useContext } from "react";

// Acá van los datos públicos que cambian al autenticarte (iniciar sesión / registrarse / cargar sesión)
type AuthInfo =
  | { isAuthenticated: false }
  | { isAuthenticated: true, role: 'artist' | 'label' };

const defaultAuthInfo: AuthInfo = { isAuthenticated: false };

//// Contexts

// Utiliza los valores por defecto
const AuthInfo = createContext<AuthInfo>(defaultAuthInfo);

// Utiliza los valores por defecto
// Este provider eventualmente se encargaría de hacer el login cuando uno entra
//   a la aplicación, mostrando un spinner primero
export function AuthInfoProvider(props: PropsWithChildren) {
  return (
    <AuthInfo.Provider value={defaultAuthInfo}>
      {props.children}
    </AuthInfo.Provider>
  );
}

//// Hooks

export function useIsAuthenticated() {
  return useContext(AuthInfo).isAuthenticated;
}

export function useIsNotAuthenticated() {
  return !useContext(AuthInfo).isAuthenticated;
}

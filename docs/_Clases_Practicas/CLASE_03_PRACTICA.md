# Programación de dispositivos móviles

## Práctica 3 — Organisms, capa de datos mock y estados de pantalla

**Prerrequisitos:**

- [CLASE_02_PRACTICA.md](./CLASE_02_PRACTICA.md) — hooks y ciclo de vida.
- [CLASE_02_PRACTICA_B.md](./CLASE_02_PRACTICA_B.md) — carpetas, atoms, molecules, pantallas estáticas (ideal haberla practicado o tener equivalente en el repo).

**Objetivos de esta clase:**

1. Entender **organisms**: bloques grandes de UI que **no** llaman HTTP, pero sí componen molecules/atoms y reciben datos ya resueltos.
2. Introducir la **primera capa de datos falsa (mock)** que imita `GET /releases` sin depender de stage.
3. Mover la lógica async a **`features/` + `services/api/`** y dejar la **screen** como orquestadora (loading / error / vacío / éxito).
4. Integrar el trabajo que ya empezaron compañeros en **`main`** y en las ramas remotas.

**Qué NO hace esta práctica (a propósito):**

- No conecta todavía a **r8-api** real (URL de stage, JWT, refresh).
- No implementa login productivo (`POST /auth/login`).
- No resuelve todos los conflictos de merge entre equipos; sí explica **cómo conviven** las ramas.

---

## 0. Estado actual del repo (leer antes de codear)

Revisado contra `main` y las ramas remotas del curso.

> **Actualizado jun 2026.** La navegación ya está mergeada en `main`. Para deuda técnica, contrato HTTP y convenciones de carpetas, leer primero [CLASE_03_PRACTICA_B.md](./CLASE_03_PRACTICA_B.md).

### `main` (rama integrada)

| Qué hay | Detalle |
|---------|---------|
| Entrypoint | **`index.tsx`** en la raíz → monta `<Navigation />`. **No existe `App.tsx`.** |
| Navegación | **React Navigation 7** (Static API): stacks Auth, Artist y Label con guards por rol. |
| `src/screens/` | ~27 pantallas placeholder bajo `Auth/`, `Artist/`, `Label/`. |
| Tokens | **`src/constants/design.ts`** — convención única del curso (no `src/design/tokens/`). |
| `src/components/*` | Carpetas con `.keep` — **sin atoms/molecules/organisms** implementados aún. |
| `src/services/api/`, `src/types/` | Vacíos — mocks locales por pantalla hasta el hito transversal de `apiClient`. |
| Auth | `AuthInfoProvider` en `src/features/auth/info.tsx` — hoy siempre `isAuthenticated: false`. Para desarrollo: flag o menú dev con `{ isAuthenticated: true, role: 'label' \| 'artist' }`. |

### Ramas de alumnos (contexto histórico)

| Rama | Nota |
|------|------|
| `origin/releases-screen` y similares | Pueden importar `design/tokens` o componentes inexistentes en `main` → adaptar a `constants/design` al integrar. |
| Varias `feat/*` | Servicios, tipos y UI repartidos entre ramas → PRs chicos y rebase frecuente sobre `main`. |

### Conclusión para la Clase 3

- La **infra de navegación ya está** en `main`; no reinstalar React Navigation ni recrear `App.tsx`.
- Esta práctica sigue válida en **organisms, mocks y capa `features/` + `services/api/`**; la screen orquesta estados loading/error/vacío/éxito.
- Convención de tokens: **`src/constants/design.ts`**. Si tu rama usa `src/design/tokens/`, unificá en PR antes de mergear.

---

## Cómo leer cada paso

Igual que en Práctica B:

| Bloque | Significado |
|--------|-------------|
| **Qué** | Resultado concreto. |
| **Cómo** | Archivos, comandos, código. |
| **Por qué** | Decisión de diseño / curso. |
| **Cómo funciona** | React, hooks, capas. |

---

## 1. Repaso: ¿qué es un organism?

### Qué

Diferenciar **molecule** vs **organism** con un criterio operativo del curso.

### Cómo

Usá esta tabla al decidir dónde va un componente nuevo:

| Nivel | Tamaño mental | ¿Llama HTTP? | Ejemplo en R8 |
|-------|----------------|-------------|----------------|
| Atom | Un control | No | `PrimaryButton`, `AppText` |
| Molecule | “Una pieza chica con sentido” | No | `ListRowCard`, `LabeledTextField` |
| Organism | “Media pantalla o sección grande” | **No** | `LoginForm`, `ReleasesListContent` |
| Screen | Pantalla registrada en navegación | Orquesta hooks/API | `ReleasesListScreen`, `LoginScreen` |
| Feature (hook) | Lógica reutilizable | Sí (vía service) | `useReleases`, `useLogin` |

### Por qué

En [ATOMIC_DESIGN.md](../ATOMIC_DESIGN.md) el organism **LoginForm** ya aparece como ejemplo: agrupa campos y botón, pero el `POST /auth/login` vive en la screen o en `useLogin`.

Si el organism hace `fetch`, se acopla al backend y no podés mostrar la misma UI con mock en clase ni en tests.

### Cómo funciona

Flujo objetivo de la Clase 3 (releases):

```text
ReleasesListScreen
    → useReleases()        // features: estado + efecto
        → fetchReleases()  // services/api: mock o HTTP real
    → props → ReleasesListContent  // organism: solo UI
        → ListRowCard[]            // molecules
```

La screen **elige** qué renderizar según `loading | error | empty | data`.

---

## 2. Rama de trabajo e integración (Git)

### Qué

Cada equipo trabaja sin pisar al resto y converge a `main` con PRs chicos.

### Cómo

**Sugerencia de base por equipo:**

| Equipo / tema | Rama sugerida | Base recomendada |
|---------------|---------------|------------------|
| Navegación + auth | Seguir `feat/react-navigation` o PR a `main` | `main` + merge de navigation |
| Releases + mock API | `releases-screen` → renombrar a `feat/releases-mock` | `main` **después** de mergear navigation (o resolver conflictos) |
| Organisms compartidos | `feat/ui-organisms` | La rama que ya tenga `constants/design.ts` |

Comandos típicos (ejemplo Equipo 4):

```bash
git fetch origin
git checkout releases-screen
# o: git checkout -b feat/releases-mock origin/main

git merge origin/feat/react-navigation   # si ya mergearon navigation en main, usar origin/main
# Resolver conflictos en package.json, index.tsx vs App.tsx, rutas de constants
```

**Conflictos esperados:**

| Archivo | Origen del conflicto | Resolución habitual |
|---------|----------------------|---------------------|
| `package.json` | Solo una rama instaló navigation | Quedarse con dependencias de `feat/react-navigation`. |
| `App.tsx` vs `index.tsx` | Una rama movió el entrypoint | Acordar con el profe: **una** entrada (`index.ts` o `index.tsx`) que monte navegación. |
| Tokens | `design/tokens` vs `constants/design.ts` | Unificar en `src/constants/design.ts`. |
| `ReleasesListScreen` imports | Rutas viejas Práctica B | Actualizar a `../../constants/design` y components reales. |

### Por qué

35 alumnos en paralelo necesitan **contratos claros**: quién toca `navigation/index.tsx`, quién agrega organisms, quién agrega `services/api`.

### Cómo funciona

Git no “mezcla lógica”; solo mezcla texto. Por eso esta clase define **capas** fijas: si cada PR respeta carpetas, los conflictos son acotados.

---

## 3. Dependencias: Safe Area (si aún no está)

### Qué

Poder usar `SafeAreaView` en pantallas como en `releases-screen`.

### Cómo

Si tu rama **no** tiene navigation instalada:

```bash
npx expo install react-native-safe-area-context
```

(Si ya seguiste `feat/react-navigation`, ya está.)

### Por qué

Lista y formularios no deben quedar bajo el notch. Es independiente del mock, pero común en todas las screens.

### Cómo funciona

`react-native-safe-area-context` lee los insets del dispositivo y aplica padding; no depende de la API mock.

---

## 4. Tipos: modelo mínimo de un release (DTO simplificado)

### Qué

Un tipo TypeScript alineado a lo que después devolverá `GET /releases` ([DTOs_Y_CUERPOS_HTTP.md](../DTOs_Y_CUERPOS_HTTP.md) — listado del tenant).

### Cómo

**Archivo:** `src/types/release.ts`

```ts
/** Subconjunto del release para listados (mock y futura API). */
export type ReleaseType = 'EP' | 'VA' | 'ALBUM';

export type ReleaseListItem = {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  releaseDate: string; // ISO 8601, ej. "2026-05-01"
};
```

**Archivo:** `src/types/index.ts` (opcional, reexport)

```ts
export type { ReleaseListItem, ReleaseType } from './release';
```

### Por qué

El mock y la API real deben devolver **la misma forma**. Así, el día que cambiés `USE_MOCK` a `false`, el organism no se entera.

### Cómo funciona

TypeScript desaparece al compilar; en runtime solo hay objetos JS. El valor está en autocompletado y en errores en compile-time si el mock se desvía.

---

## 5. Mock de API: datos falsos + función que simula red

### Qué

Capa en `services/api` que **no** usa `fetch` todavía, pero sí `async`, demora y posible error para practicar estados.

### Cómo

**Archivo:** `src/services/api/config.ts`

```ts
/** Cuando el curso habilite stage, cambiar BASE_URL y USE_MOCK. */
export const apiConfig = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  useMock: true,
  /** Demora artificial para ver spinners en clase (ms). */
  mockDelayMs: 800,
} as const;
```

**Archivo:** `src/services/api/mocks/releases.mock.ts`

```ts
import type { ReleaseListItem } from '../../../types/release';

export const MOCK_RELEASES: ReleaseListItem[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    title: 'EP Demo',
    artist: 'Artista X',
    type: 'EP',
    releaseDate: '2026-05-01T00:00:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    title: 'Album Demo',
    artist: 'Artista Y',
    type: 'ALBUM',
    releaseDate: '2025-11-15T00:00:00.000Z',
  },
];
```

**Archivo:** `src/services/api/releasesApi.ts`

```ts
import { apiConfig } from './config';
import { MOCK_RELEASES } from './mocks/releases.mock';
import type { ReleaseListItem } from '../../types/release';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simula GET /releases del label autenticado (tenant por JWT en producción). */
export async function fetchReleases(): Promise<ReleaseListItem[]> {
  if (apiConfig.useMock) {
    await wait(apiConfig.mockDelayMs);
    // Descomentar en clase para practicar pantalla de error:
    // throw new Error('Error de red simulado');
    return [...MOCK_RELEASES];
  }

  const res = await fetch(`${apiConfig.baseUrl}/releases`, {
    headers: { Accept: 'application/json' },
    // Authorization: Bearer … en clase posterior
  });
  if (!res.ok) {
    throw new Error(`releases: ${res.status}`);
  }
  const data = await res.json();
  // GET /releases → { releases, hostingQuota, releaseAudioQuota } (no array plano)
  if (Array.isArray(data)) return data as ReleaseListItem[];
  return (data.releases ?? []) as ReleaseListItem[];
}
```

### Por qué

- **Desacopla** pantalla y organism del origen de datos.
- Permite desarrollo sin VPN/stage y cumple la regla del plan: “mock primero, API después”.
- `mockDelayMs` hace visible el estado **loading** (en datos reales también hay latencia).

### Cómo funciona

`fetchReleases` devuelve una **Promise**. Hasta que resuelve, quien la llamó puede mostrar spinner. `throw` en el mock reproduce el camino `catch` → mensaje de error. Cuando `useMock` sea `false`, el mismo nombre de función llamará al HTTP real ([REFERENCIA_API_R8.md](../REFERENCIA_API_R8.md) — `GET /releases` devuelve **`data.releases`**, no un array plano).

---

## 6. Feature hook: `useReleases`

### Qué

Encapsular en `features/releases` el patrón **loading → éxito | error | vacío** que pedirán en todas las pantallas del plan.

### Cómo

**Archivo:** `src/features/releases/useReleases.ts`

```ts
import { useCallback, useEffect, useState } from 'react';
import { fetchReleases } from '../../services/api/releasesApi';
import type { ReleaseListItem } from '../../types/release';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ReleaseListItem[] };

export function useReleases() {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await fetchReleases();
      if (data.length === 0) {
        setState({ status: 'empty' });
      } else {
        setState({ status: 'success', data });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido';
      setState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
}
```

### Por qué

La screen no debería repetir este `useEffect` en Dashboard, Promos, Feedback, etc. El hook es el lugar del **dominio releases** ([PLAN_TRABAJO_ALUMNOS_RN.md](../PLAN_TRABAJO_ALUMNOS_RN.md) — carpeta `features/<dominio>/`).

### Cómo funciona

1. Primer render: `state = loading`.
2. `useEffect` dispara `load()` una vez al montar (`[]` vía `useCallback` estable).
3. Cuando la Promise termina, `setState` provoca **re-render** de la screen.
4. `reload` permite “Reintentar” sin remontar la pantalla (útil en error).

Relación con Clase 2: acá `useEffect` depende de `[load]`; `load` es estable porque sus dependencias son `[]`. Es el patrón “cargar al entrar a la pantalla”.

---

## 7. Molecules de estado (loading / vacío / error)

### Qué

Piezas chicas reutilizables para no duplicar JSX en cada organism.

### Cómo

**Archivo:** `src/components/molecules/LoadingBlock.tsx`

```tsx
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { spacing } from '../../constants/design';

type Props = { message?: string };

export function LoadingBlock({ message = 'Cargando…' }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" />
      <AppText muted style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, alignItems: 'center', gap: spacing.md },
  text: { marginTop: spacing.sm },
});
```

**Archivo:** `src/components/molecules/EmptyState.tsx`

```tsx
import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { spacing } from '../../constants/design';

type Props = { title: string; description?: string };

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">{title}</AppText>
      {description ? (
        <AppText muted style={styles.desc}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg },
  desc: { marginTop: spacing.sm },
});
```

**Archivo:** `src/components/molecules/ErrorState.tsx`

```tsx
import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { spacing } from '../../constants/design';

type Props = { message: string; onRetry?: () => void };

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">Algo salió mal</AppText>
      <AppText muted style={styles.msg}>
        {message}
      </AppText>
      {onRetry ? (
        <PrimaryButton title="Reintentar" onPress={onRetry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, gap: spacing.md },
  msg: { marginBottom: spacing.sm },
});
```

> **Nota:** Si en tu rama aún no existen `AppText` ni `PrimaryButton`, copiarlos de [CLASE_02_PRACTICA_B.md](./CLASE_02_PRACTICA_B.md) adaptando imports a `../../constants/design` (o creá versiones mínimas en un PR `feat/ui-atoms`).

### Por qué

El plan exige **loading, error y vacío** en cada entrega. Centralizarlos evita cinco diseños distintos de “spinner”.

### Cómo funciona

Son molecules **tontas**: reciben texto y callbacks. No saben si el error vino del mock o de un 401 real.

---

## 8. Organism: `ReleasesListContent`

### Qué

Bloque de UI que muestra título + lista **o** loading / error / vacío, según props.

### Cómo

**Archivo:** `src/components/organisms/ReleasesListContent.tsx`

```tsx
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenTitle } from '../atoms/ScreenTitle';
import { ListRowCard } from '../molecules/ListRowCard';
import { LoadingBlock } from '../molecules/LoadingBlock';
import { EmptyState } from '../molecules/EmptyState';
import { ErrorState } from '../molecules/ErrorState';
import type { ReleaseListItem } from '../../types/release';
import { spacing, colors } from '../../constants/design';

export type ReleasesListContentProps = {
  status: 'loading' | 'error' | 'empty' | 'success';
  releases?: ReleaseListItem[];
  errorMessage?: string;
  onRetry?: () => void;
  onPressRelease?: (id: string) => void;
};

function formatSubtitle(item: ReleaseListItem) {
  const year = item.releaseDate.slice(0, 4);
  return `${item.type} · ${year}`;
}

export function ReleasesListContent({
  status,
  releases = [],
  errorMessage,
  onRetry,
  onPressRelease,
}: ReleasesListContentProps) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ScreenTitle
        title="Releases"
        subtitle="Catálogo del label (mock GET /releases)"
      />

      {status === 'loading' && (
        <LoadingBlock message="Cargando releases…" />
      )}

      {status === 'error' && (
        <ErrorState message={errorMessage ?? 'Error'} onRetry={onRetry} />
      )}

      {status === 'empty' && (
        <EmptyState
          title="Sin releases"
          description="Cuando crees un release aparecerá acá."
        />
      )}

      {status === 'success' &&
        releases.map((item) => (
          <ListRowCard
            key={item.id}
            title={`${item.title} — ${item.artist}`}
            subtitle={formatSubtitle(item)}
            onPress={
              onPressRelease ? () => onPressRelease(item.id) : undefined
            }
          />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
});
```

**Ajuste en `ListRowCard`** (si no tiene `onPress`):

```tsx
import { Pressable, View, StyleSheet } from 'react-native';
// … imports

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export function ListRowCard({ title, subtitle, onPress }: Props) {
  const content = (
  <View style={styles.row}>
    <AppText variant="body">{title}</AppText>
    {subtitle ? (
      <AppText variant="caption" muted>
        {subtitle}
      </AppText>
    ) : null}
  </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
      {content}
    </Pressable>
  );
}
```

### Por qué

- Equipo 4 deja de tener arrays `PLACEHOLDER_RELEASES` **dentro** de la screen.
- Otros equipos pueden copiar el patrón `ListContent` + `useX` para promos, audience lists, etc.
- El organism sigue sin importar `fetchReleases`.

### Cómo funciona

La screen pasa `status` derivado del hook:

```ts
const { state, reload } = useReleases();
const status = state.status;
const releases = state.status === 'success' ? state.data : undefined;
```

React vuelve a renderizar el organism cuando `state` cambia; el organism solo **ramifica** JSX (if por `status`), no dispara efectos.

---

## 9. Screen refactorizada: `ReleasesListScreen`

### Qué

Reemplazar la versión solo-estática de `releases-screen` por orquestación con hook + organism.

### Cómo

**Archivo:** `src/screens/releases/ReleasesListScreen.tsx`

```tsx
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReleasesListContent } from '../../components/organisms/ReleasesListContent';
import { useReleases } from '../../features/releases/useReleases';
import { colors } from '../../constants/design';

export function ReleasesListScreen() {
  const { state, reload } = useReleases();

  const status = state.status;
  const errorMessage = state.status === 'error' ? state.message : undefined;
  const releases = state.status === 'success' ? state.data : undefined;

  return (
    <SafeAreaView style={styles.safe}>
      <ReleasesListContent
        status={status}
        releases={releases}
        errorMessage={errorMessage}
        onRetry={reload}
        onPressRelease={(id) => {
          // Clase 4: navigation.navigate('ReleaseDetail', { id })
          console.log('release', id);
        }}
      />
    </SafeAreaView>
  );
}
```

### Por qué

Esta es la pantalla que ya existe en la rama `releases-screen`; la Clase 3 **evoluciona** ese archivo sin tirar el trabajo hecho.

### Cómo funciona

`SafeAreaView` → organism → molecules. La screen tiene **pocas líneas** y es fácil de leer en code review. `console.log` es temporal hasta conectar detalle en navegación.

---

## 10. Registrar la pantalla en navegación

Elegí **un** camino según tu rama.

### Opción A — Estás en `feat/react-navigation` (static API)

### Qué

Mostrar Releases dentro del stack del label cuando exista dashboard (o temporalmente en Auth para probar).

### Cómo

1. Importar la screen en `src/navigation/index.tsx`.
2. Agregar pantalla al stack que corresponda. Ejemplo **temporal** para probar mock (hasta tener Dashboard real):

```tsx
import { ReleasesListScreen } from '../screens/releases/ReleasesListScreen';

// Dentro del LoginStack o un nuevo LabelStack de prueba:
screens: {
  // … Login, SignUp, PasswordReset
  ReleasesList: ReleasesListScreen,
}
```

3. Navegar desde un botón de prueba en `LoginScreen`:

```tsx
import { useNavigation } from '@react-navigation/native';

// dentro del componente:
const navigation = useNavigation();
// …
<PrimaryButton
  title="[Dev] Ver releases mock"
  onPress={() => navigation.navigate('ReleasesList' as never)}
/>
```

Consultá el mapa de rutas en `docs/screens.md` de esa rama para no inventar nombres distintos al acuerdo del equipo.

### Por qué

Sin registrar la screen, el archivo existe pero la app nunca lo monta.

### Cómo funciona

Static navigator registra rutas en build-time del bundle; `navigate('ReleasesList')` debe coincidir con la clave del objeto `screens`.

---

### Opción B — Seguís el `DevMenu` de Práctica B

### Cómo

En `RootStackParamList` y `Stack.Screen`, agregar `ReleasesList` apuntando a `ReleasesListScreen` (igual que en Práctica B, pero con la screen nueva).

### Por qué

Quien aún no mergeó `feat/react-navigation` puede avanzar mock + organism sin bloquearse.

---

## 11. Organism + mock en Auth (Equipo 1 — extensión)

### Qué

Mismo patrón que releases, pero para login: `LoginForm` + `authApi.loginMock` + `useLogin`.

### Cómo (resumen)

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Organism | `src/components/organisms/LoginForm.tsx` | Campos + botón; props de loading/error (ver [ATOMIC_DESIGN.md](../ATOMIC_DESIGN.md)). |
| Service | `src/services/api/authApi.ts` | `loginMock(email, password)` → delay → devuelve `{ accessToken: 'mock-token', role: 'label' \| 'artist' }` o error si password vacía. |
| Feature | `src/features/auth/useLogin.ts` | `login`, `loading`, `error`. |
| Screen | `src/screens/auth/LoginScreen.tsx` | Estado email/password local; `handleSubmit` llama `useLogin`; al éxito actualizar `AuthInfoProvider` (siguiente clase). |

En `feat/react-navigation`, hoy `AuthInfoProvider` siempre devuelve no autenticado. **Próximo paso** (Clase 4): guardar token en contexto o storage y hacer que `useIsAuthenticated` lea ese valor.

### Por qué

Equipo 1 ya tiene pantallas placeholder; el organism les da UI real sin esperar stage.

### Cómo funciona

Idéntico a releases: el mock imita [DTOs — POST /auth/login](../DTOs_Y_CUERPOS_HTTP.md) (`accessToken` en JSON) sin red.

---

## 12. Ejercicios en vivo (profesor)

| Ejercicio | Acción | Qué observar |
|-----------|--------|--------------|
| Ver loading | `mockDelayMs: 2000` en `config.ts` | Spinner visible. |
| Ver error | Descomentar `throw` en `fetchReleases` | `ErrorState` + Reintentar. |
| Ver vacío | `return []` en mock | `EmptyState`. |
| Ver éxito | Restaurar mock normal | Lista con IDs reales en keys. |
| Regla organism | Buscar `fetch` en `components/organisms` | No debe haber resultados. |

---

## 13. Checklist de entrega (Clase 3)

- [ ] `src/types/release.ts` creado.
- [ ] `src/services/api/config.ts`, `mocks/releases.mock.ts`, `releasesApi.ts`.
- [ ] `src/features/releases/useReleases.ts` con loading / error / empty / success.
- [ ] Molecules `LoadingBlock`, `EmptyState`, `ErrorState` (o equivalente acordado).
- [ ] Organism `ReleasesListContent` sin llamadas HTTP.
- [ ] `ReleasesListScreen` delgada; rama `releases-screen` actualizada y compilando.
- [ ] Imports unificados a `src/constants/design.ts` (no rutas rotas a `design/tokens`).
- [ ] Pantalla accesible desde navegación (static stack o DevMenu).
- [ ] (Opcional Equipo 1) `LoginForm` + `loginMock`.

---

## 14. Qué sigue

→ **[CLASE_04_PRACTICA.md](./CLASE_04_PRACTICA.md)** — apiClient, infra compartida, login stage y primera pantalla con HTTP real.

Temas que quedaron explícitamente en Clase 4 (antes listados acá):

1. **`apiClient` único** — base URL de stage, header `Authorization`, manejo de 401.
2. Sustituir `useMock: true` por `GET /releases` real ([EQUIPO_4_FUNCIONAL.md](../EQUIPO_4_FUNCIONAL.md)).
3. Conectar `AuthInfoProvider` con token real tras login ([EQUIPO_1_FUNCIONAL.md](../EQUIPO_1_FUNCIONAL.md)).
4. Detalle `GET /releases/:releaseId` y navegación con parámetro `releaseId`.
5. ~~Merge de `feat/react-navigation` a `main`~~ — **hecho** en `main`.

---

## 15. Errores típicos en esta práctica

| Síntoma | Causa | Solución |
|---------|--------|----------|
| `Unable to resolve ../../design/tokens/...` | Rama releases-screen sin atoms/tokens | Usar `constants/design` + PR de atoms. |
| Loading infinito | `useEffect` sin llamar `load` o Promise que nunca resuelve | Revisar `fetchReleases` y `useReleases`. |
| Lista no actualiza al Reintentar | `reload` no pasado a `onRetry` | Enlazar `onRetry={reload}`. |
| “Cannot read property 'map' of undefined” | Renderizar lista fuera de `status === 'success'` | Ramificar por `status` en organism. |
| Doble fetch al entrar | Strict Mode en dev o deps mal puestas | Aceptable en dev; en producción una sola carga; evitar deps innecesarias. |
| App crashea al abrir en rama navigation | `Dashboard: undefined` | Registrar placeholder o quitar ruta hasta tener pantalla. |

---

## Referencias del repo

- Atomic Design y LoginForm: [ATOMIC_DESIGN.md](../ATOMIC_DESIGN.md)
- Endpoints reales: [REFERENCIA_API_R8.md](../REFERENCIA_API_R8.md), [DTOs_Y_CUERPOS_HTTP.md](../DTOs_Y_CUERPOS_HTTP.md)
- Equipo 4: [EQUIPO_4_FUNCIONAL.md](../EQUIPO_4_FUNCIONAL.md)
- Práctica anterior: [CLASE_02_PRACTICA_B.md](./CLASE_02_PRACTICA_B.md)
- Mapa de rutas (rama navigation): `docs/screens.md` en `feat/react-navigation`

---

*Documento Clase 3 — organisms + mock API. Actualizado según estado de `main`, `feat/react-navigation` y `releases-screen`.*

# Recuperatorio — r8-mobile

**Para:** quienes tienen **menos de 6** en `tmp/EVALUACION_ALUMNOS_2026-10-29.md`  
**Corte de entrega:** jueves 5 de noviembre del 2026 (PR **mergeado** a `main`)  
**Qué suma:** **+1** o **+2**, según la consigna que elijan. Un solo tiro.

## Reglas (léanlas)

1. **Un PR, una pieza.** Eligen **la de +1 o la de +2 de su fila**. No las dos. No la de un compañero.
2. **Tiene que entrar a `main`.** Un PR abierto no suma. Rama sin PR no suma.
3. Lo que **ya está abierto o mergeado al 29 oct no cuenta** como recuperatorio (ya está en la nota). Mergear el `#76`, el `#97`, el `#103`, el `#104` o el `#106` no agrega puntos extra.
4. `npx tsc --noEmit` verde. Tokens de `src/constants/design.ts`. Sin `console.log`. Sin lockfile ni `package.json` salvo que la consigna lo pida.
5. Navegación con **`LinkButton`**, no `navigation.navigate` en un `onPress`.
6. Archivos críticos (`src/navigation/*`, átomos, `docs/` en MAYÚSCULAS, `package.json`): no los toquen. Si la consigna roza uno, avisen al TL **antes**.
7. Pueden usar IA. Tienen que poder explicar el diff.

Tope: la nota del 29 **más** 1 o 2. Nadie hace dos recuperatorios.

---

## Equipo 1

| Alumno | Nota hoy | **+1** | **+2** |
|--------|----------|--------|--------|
| Galarraga, Ignacio David | 3 | Test de `Avatar` (`src/components/atoms/Avatar.test.tsx`). No cambien el átomo. | En Login, si el API responde **403** `"Email verification required"`, mostrar `VerifyEmailForm` (PIN). Archivos: `useLogin.ts` + `Login.tsx`. Spec Equipo 1 §2.3. |
| Fuchs, María Yanina | 3 | Tests de `PasswordResetForm` (organismo, un archivo de test). | Tras `POST /users/password/reset`, **dejar la sesión iniciada** con el `accessToken` del JSON (`applySession`), no un paso “ya podés iniciar sesión”. Archivos: `usePasswordReset.ts` + `PasswordReset.tsx`. Spec §2.5. |
| Martinez, Cecilia | 4 | Tests de `RegisterForm`. | Confirmación al cerrar sesión en `Artist/Profile/View.tsx` con el `Modal` del Equipo 3 (mismo patrón que el perfil label). Un archivo de pantalla. |
| Planchón, Tomás Eduardo | 0 | Tests de `Checkbox` o `ErrorMessage` (el que no tenga test). Un archivo. | Mostrar **Twitter** en `Artist/Profile/View.tsx` (el Edit ya lo tiene; la View no). Campo `ProfileField`, nada más. Si querés el +2 entero: eso **y** un empty decente cuando bio/redes vienen vacíos. |
| Zabala, Daniel Esteban | 4 | Abrí **un PR** con la rama `feature/foto-perfil-artista` (el commit del 22 oct). Sin PR no es entrega. | Ese PR **más** tests del hook `useArtistImage`. Que `tsc` pase. |

## Equipo 2

| Alumno | Nota hoy | **+1** | **+2** |
|--------|----------|--------|--------|
| Galo Roig, Damián | 5 | Tests de `useLabelImage` (el de `src/features/label/`). El `#97` no suma extra; esto sí, **después** de que el hook real esté en `main`. | El Dashboard **usa** el `Card` de Peralta para el bloque de bienvenida (hoy el `Card` no lo usa nadie). Solo `Dashboard.tsx`. |
| Rodríguez, Enzo Alejandro | 4 | Tests de `Card`. El `#104` no suma extra. | `SearchField` en el Dashboard para filtrar las promos recientes **en cliente**. Archivo: `Dashboard.tsx`. No pidas un endpoint nuevo. |
| Romani, Nicolás | 5 | Tests de `useUpdateLabelProfile`. | En Analytics, un filtro en cliente por release (lista `byRelease`: mostrar uno, todos, o los que matcheen un `SearchField`). Solo `Analytics.tsx`. |

Galo y Rodríguez no elijan los dos `Dashboard.tsx`. Si los dos van al +2, el TL asigna: Galo se queda el `Card`, Rodríguez el `SearchField`, **en PRs distintos y en serie** (uno mergea, el otro rebasea). Mejor: uno elige +1.

## Equipo 3

| Alumno | Nota hoy | **+1** | **+2** |
|--------|----------|--------|--------|
| Bianchi, Germán | 5 | PR **propio** de `PromoTrackRow` (está en `origin/features/promo-details(test)`, sin PR). Commits en la rama de otro no cuentan. | Ese PR **más** tests de la molécula **y** que `Artist/Promos/Details.tsx` la use. |
| Gutiérrez, Magalí | 4 | Tests de `useLikedTracks`. El `#103` no suma extra. | Confirmación con `Modal` **antes** de quitar un track de favoritos (`LikedTracks.tsx`). Producto, no otro test. |
| Romero, Giuliana | 5 | En `Modal.tsx`, sacar `gap: 5` y el `rgba(...)` hardcodeados: usen tokens de `design.ts`. No editen `design.ts` si el token ya existe (`colors.surface` / `spacing`). El `#106` no suma extra. | Al enviar el Feedback del artista, mostrar el `Modal` de éxito (o el de error) en `Artist/Promos/Feedback.tsx`. El componente deja de estar “por las dudas”. |

## Equipo 4

| Alumno | Nota hoy | **+1** | **+2** |
|--------|----------|--------|--------|
| Ramos, Agustín | 5 | Abrí **un PR** de `feat/promos-new-screen` (New de promo). La rama existe; sin PR no es entrega. | Ese PR **más** reemplazar el `Button` disabled “Nueva promo” en `Releases/Promos/List.tsx` por un `LinkButton` a `New`. |

## Equipo 5

| Alumno | Nota hoy | **+1** | **+2** |
|--------|----------|--------|--------|
| Cabrera, Franco | 5 | En `RecipientLists/List.tsx`, el botón “Nueva lista” pasa a `LinkButton` hacia `New`. El `#76` no suma extra; este cableado sí (mergeen el `#76` **antes**). | Eso **y** que cada `RecipientListRow` sea un `LinkButton` a `Details` con `{ listId }`. La screen envuelve la fila; la molécula **no** importa navegación. |
| Vitasse, Pablo Enrique | 0 | Tests de `Badge` o `RecipientMemberRow` (un archivo). | En `RecipientLists/Details.tsx`, el botón “Cargar CSV” disabled pasa a `LinkButton` a `BulkUpload` con `{ listId }`. La pantalla destino puede seguir placeholder; el link es el recorte. |

---

## Qué no vale

- Reescribir Login, Player, Details de listas o Edit de release “porque ya lo vi”.
- Un dump de `main` en la rama, lockfile, o un segundo componente “por las dudas”.
- Hacer la consigna de otro porque parece más fácil.
- Abrir el PR el miércoles a la noche y no rebasear: si no entra a `main` el jueves, no suma.

## Cómo se mira el jueves

La pregunta es: **“¿Cuál es tu PR de recuperatorio, y en qué archivo se ve?”**  
Si el archivo no es el de la tabla, no es esta entrega.

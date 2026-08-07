# Programación de dispositivos móviles

## Práctica 3B — Alineación del proyecto: deuda técnica, contrato API y cómo seguir sin romper integración

**Prerrequisitos:**

- [CLASE_03_PRACTICA.md](./CLASE_03_PRACTICA.md) — organisms, mocks, `features/` + `services/api/`, estados de pantalla.
- Documentación HTTP actualizada del curso:
  - [REFERENCIA_API_R8.md](../REFERENCIA_API_R8.md) (v2026-06-17)
  - [DTOs_Y_CUERPOS_HTTP.md](../DTOs_Y_CUERPOS_HTTP.md) (v2026-06-17)

**Tipo de clase:** principalmente **explicativa y de acuerdos de equipo**. No es obligatorio entregar código nuevo al final de la hora; el objetivo es que todos entiendan **qué estaba mal o desactualizado**, **qué convención adoptamos** y **cómo evitar repetir los mismos bloqueos** al conectar stage y al mergear ramas.

**Qué hace esta práctica:**

1. Recorre los **puntos problemáticos** detectados al revisar `main`, ramas de alumnos, documentación vieja y el contrato real de **r8-api** / **r8-site**.
2. Propone **solución concreta** para cada tema (decisión del curso + acción técnica).
3. Deja un **checklist** para que, después de la clase, el docente actualice el resto de la documentación y los equipos corrijan su código en PRs pequeños.

**Qué NO hace esta práctica (a propósito):**

- No reemplaza la actualización masiva de README, `_INIT.md`, `EQUIPO_*`, etc. (eso queda para después de la clase, a cargo del docente).
- No implementa en vivo toda la Fase 0 del plan (apiClient productivo, login real, tabs); define **prioridades** y **orden** para hacerlo sin caos.

---

## Cómo leer cada bloque

| Bloque | Significado |
|--------|-------------|
| **Problema** | Qué observamos (síntoma o confusión típica). |
| **Por qué importa** | Impacto en compile, integración o consumo de API. |
| **Solución acordada** | Qué debe hacer el curso / cada equipo. |
| **Referencia** | Dónde está la verdad hoy. |

---

## 0. Mensaje central de la clase

> El repo **r8-mobile** tiene buena documentación de producto y un **esqueleto de navegación** en `main`, pero el trabajo de los equipos está **fragmentado en ramas** y parte de la documentación **no reflejaba** ni el estado del código ni el contrato HTTP vigente de **r8-api**.  
> A partir de esta clase, la **fuente de verdad del HTTP** son `REFERENCIA_API_R8.md` y `DTOs_Y_CUERPOS_HTTP.md` (junio 2026). El resto de los `.md` se irán alineando después; si hay duda, **ganan esos dos archivos** y el cliente web `r8-site/src/api/`.

**API Stage del curso:**

```text
https://api-stage.technopremieres.com
```

Comprobar que responde: `GET /health` → **200**.

Variable sugerida en el proyecto (cuando conecten HTTP real):

```bash
EXPO_PUBLIC_API_URL=https://api-stage.technopremieres.com
```

---

## 1. Documentación vs estado real de `main`

### Problema 1.1 — Sigue diciendo “template App.tsx”

Varios documentos (`README.md`, `_INIT.md`, sección 0 de [CLASE_03_PRACTICA.md](./CLASE_03_PRACTICA.md)) describen un proyecto mínimo con **`App.tsx`** y texto de bienvenida de Expo.

**Estado real en `main` (jun 2026):**

- Entrypoint: **`index.tsx`** en la raíz → monta `<Navigation />`.
- **No existe** `App.tsx`.
- Hay **27 pantallas** placeholder en `src/screens/` y navegación por rol (Auth / Artist / Label) con React Navigation 7 (Static API).

| Por qué importa | Los alumnos buscan archivos que no existen o piensan que la navegación “todavía no está”. |
| Solución acordada | Tras la clase, actualizar README y `_INIT` (docente). En código: **no volver a crear `App.tsx`**; el entrypoint del curso es `index.tsx`. |
| Referencia | `index.tsx`, `src/navigation/index.tsx` |

---

### Problema 1.2 — CLASE_03 §0 dice que no hay React Navigation en `main`

La Práctica 3 original fue escrita **antes** del merge del PR de navegación.

| Por qué importa | Quien solo lee CLASE_03 instala de nuevo dependencias o duplica trabajo de infra. |
| Solución acordada | Considerar **obsoleto** el apartado “sin navegación en main”. La Práctica 3 sigue válida en organisms/mocks; la infra de stacks **ya está**. |
| Referencia | Commit `feat: React Navigation (pr #2)` en `main` |

---

### Problema 1.3 — Dos convenciones de carpetas y tokens

| Documento / rama antigua | Convención |
|--------------------------|------------|
| `CLASE_02_PRACTICA_B`, ramas `releases-screen` | `src/design/tokens/`, `screens/releases/` |
| `main` actual, CLASE_03 | `src/constants/design.ts`, `screens/Label/Releases/` |

| Por qué importa | Imports rotos (`Unable to resolve ../../design/tokens/...`) al mergear ramas. |
| Solución acordada | **Una sola convención en el curso:** tokens en **`src/constants/design.ts`**; pantallas bajo **`src/screens/{Auth,Artist,Label}/...`** como en `main`. Al traer código de ramas viejas, **adaptar rutas de import**, no duplicar carpetas. |
| Referencia | [ATOMIC_DESIGN.md](../ATOMIC_DESIGN.md), `src/constants/design.ts` |

---

### Problema 1.4 — Índice de documentación incompleto

`README.md` no enlazaba `ATOMIC_DESIGN.md`, `screens.md`, prácticas de clase, ni la URL de stage.

| Solución acordada | Tras la clase, el docente amplía el índice. Los alumnos deben conocer al menos: plan de equipos, referencia API, DTOs, atomic design, `screens.md`. |

---

## 2. Código en `main`: esqueleto fuerte, integración débil

### Problema 2.1 — Fase 0 del plan sin cerrar

Según [PLAN_TRABAJO_ALUMNOS_RN.md](../PLAN_TRABAJO_ALUMNOS_RN.md), la Fase 0 pedía: navegación, **apiClient**, tokens, tipos mínimos, mocks.

| Entregable Fase 0 | Estado en `main` |
|-------------------|------------------|
| Navegación por rol | Hecho (stacks + guards stub) |
| `src/constants/design.ts` | Ejemplo presente |
| `src/components/*` | Solo `.keep` — **sin UI compartida** |
| `src/services/api/` | Vacío |
| `src/types/` | Vacío |
| Auth real | `AuthInfoProvider` siempre `isAuthenticated: false` |

| Por qué importa | Cada equipo reimplementa fetch, tipos y atoms en su rama; los PR no compilan al integrar. |
| Solución acordada | **Próximo hito transversal** (1–2 personas + revisión del profe, luego merge a `main`): `apiClient` mínimo + 2–3 atoms (`AppText`, `PrimaryButton`, `LabeledTextField`) + tipos compartidos de release/promo según DTOs. Hasta entonces, **mocks locales** por pantalla están bien, pero imports deben apuntar a `constants/design`. |
| Referencia | PLAN § Fase 0, CLASE_03 pasos de `services/api` |

---

### Problema 2.2 — Ramas de alumnos fragmentadas

Ramas remotas con trabajo parcial: `feat/login-components`, `feat/state-molecules`, `releases-screen`, `feature/releases-api`, `feature/label-profile`, etc.

Síntomas típicos:

- Pantalla que importa `design/tokens` o componentes que no existen en `main`.
- Servicios en una rama, tipos en otra, atoms en otra.
- Misma pantalla con nombres distintos (`ReleasesListScreen` vs `LabelReleasesListScreen`).

| Solución acordada | Reglas de integración: (1) **rama corta** por feature, (2) **rebase sobre `main` frecuente**, (3) antes del PR: `npm start` sin errores de Metro, (4) no mezclar “infra + 5 pantallas” en un solo PR, (5) si falta un atom compartido, **PR pequeño solo de UI** primero. |
| Referencia | PLAN § estrategia anti-bloqueos |

---

### Problema 2.3 — Auth stub: siempre pantalla de Login

`src/features/auth/info.tsx` fija `isAuthenticated: false` → nadie ve stacks Artist/Label sin hack.

| Por qué importa | Equipos 2–5 no prueban flujos label; Equipo 3 no prueba artista logueado. |
| Solución acordada | **Corto plazo (desarrollo):** flag o menú dev que setee `{ isAuthenticated: true, role: 'label' \| 'artist' }` (como el `DevMenu` de Práctica 2B, si lo tienen). **Mediano plazo:** Equipo 1 implementa login mock → login real contra stage con `POST /auth/login` + guardar `accessToken`. |
| Referencia | CLASE_03 sección login mock; DTOs § Auth |

---

### Problema 2.4 — Pantallas faltantes en navegación

Documentación funcional menciona **Splash/bootstrap**; no hay ruta en `src/navigation/index.tsx`.

Tampoco hay **bottom tabs** (Artist: Promos vs Profile; Label: muchas secciones).

| Por qué importa | UX incompleta; alumnos no saben dónde colgar el bootstrap de sesión. |
| Solución acordada | **Splash:** Equipo 1 — stack Auth o root con `initialRouteName` que resuelva `POST /auth/refresh` + `GET /users/me` antes de mostrar Login o el stack por rol. **Tabs:** decisión de diseño pendiente; hasta tener tabs, stacks anidados actuales son aceptables para el curso si documentamos la limitación. |
| Referencia | [EQUIPO_1_FUNCIONAL.md](../EQUIPO_1_FUNCIONAL.md), [screens.md](../screens.md) |

---

### Problema 2.5 — Player sin login (`?token=`)

`screens.md` anota que el inbox de promos **podría** ser accesible sin cuenta (contacto promo con token en el link del mail).

La navegación actual exige `useIsArtist` para el stack Artist.

| Solución acordada | Flujo receptor = **no es el stack Artist registrado**; es un flujo **guest** con `?token=` en las llamadas API (ver §4). En mobile puede ser: deep link / pantalla Player que no pasa por login, o stack Artist con token en memoria sin Bearer. Equipo 3 + profe definen UX; el contrato HTTP ya está en referencia API. |
| Referencia | [REFERENCIA_API_R8.md](../REFERENCIA_API_R8.md) § inbox |

---

## 3. Contrato HTTP: errores que tenía la documentación vieja

Esta sección es el **núcleo de la clase**. La documentación anterior del repo mobile no coincidía con **r8-api** ni con **r8-site**. Ya está corregida en `REFERENCIA_API_R8.md` y `DTOs_Y_CUERPOS_HTTP.md`; acá va el “por qué” para que no vuelvan a implementar lo incorrecto.

### Problema 3.1 — Rutas bajo `/labels/:labelId/...`

Documentación antigua y algunos tutoriales REST asumían `GET /labels/:labelId/releases`, etc.

| Solución acordada | **Tenant por JWT.** Releases: `GET /releases`, `GET /releases/:releaseId`. Promos label: `GET /promos/for-label?labelId=`. Listas: `GET /recipient-lists` (sin label en path). |
| Referencia | REFERENCIA_API § “Qué dejó de aplicar” |

---

### Problema 3.2 — Carga masiva CSV: `bulk-upload` vs `batch`

Doc viejo: `POST /recipient-lists/:listId/recipients/bulk-upload` (multipart).

API real: **`POST /recipient-lists/:listId/recipients/batch`** con JSON.

| Cuerpo batch | Cuándo |
|--------------|--------|
| `{ "recipientIds": ["uuid", ...] }` | IDs ya en el pool del label |
| `{ "recipients": [{ "email", "display_name?" }] }` | Emails nuevos (find-or-create) |

**Exactamente uno** de los dos campos; no ambos, no ninguno.

| Por qué importa | La pantalla `BulkUpload` del mobile debe **parsear CSV/Excel en el dispositivo** (como hace r8-site) y enviar JSON al batch. No hay upload de archivo al servidor para este flujo. |
| Solución en código | Librería de parseo en cliente → mapear filas a `recipients[]` → `POST .../batch` → mostrar `{ added, skipped }`. |
| Referencia | DTOs §7 Recipient lists; `r8-site/src/api/destinataryLists.ts` → `batchAddRecipients` |

---

### Problema 3.3 — Cambio de contraseña: método HTTP

Doc viejo: `PUT /users/me/change-password`.

API real: **`POST /users/me/change-password`**.

| Solución | Al implementar perfil label/artist, usar POST con `{ currentPassword, newPassword }`. |

---

### Problema 3.4 — Unsubscribe / resubscribe

Doc viejo: `POST /users/unsubscribe/:userId`.

API real:

- `POST /users/unsubscribe` — Bearer (roles artist/label/guest) → **204**
- `POST /users/resubscribe` — igual
- Con contacto promo: contexto vía **`?token=`** en el middleware (misma familia de rutas que el web)

| Solución | No hardcodear `userId` en la URL; usar las rutas fijas y el token cuando corresponda. |

---

### Problema 3.5 — Enums de Release incorrectos

| Doc viejo (incorrecto) | API real |
|------------------------|----------|
| `type`: `EP`, `ALBUM`, `REMIX`, `SINGLE` | **`EP` \| `VA` \| `ALBUM`** |
| `status`: `DRAFT`, `PUBLISHED` | **`DRAFT` \| `CREATED`** (`CREATED` = listo para promos, no “publicado en web”) |
| `formats` no mencionado | Opcional: **`DIGITAL` \| `VINYL`** |

| Por qué importa | `POST /releases` o `PATCH` con `SINGLE` o `PUBLISHED` → **400** en stage. |
| Solución | Tipos TypeScript y formularios alineados a DTOs §5. Copiar enums del doc, no del UI web si difiere. |

---

### Problema 3.6 — Listado `GET /releases` no es un array plano

Respuesta habitual:

```json
{
  "releases": [ /* ... */ ],
  "hostingQuota": { "usedBytes": 0 },
  "releaseAudioQuota": { "maxBytes": 524288000 }
}
```

(Si el usuario no tiene label, la API puede devolver `[]` solo.)

| Solución | En `fetchReleases`, leer `data.releases` (patrón igual que `releasesService.getAll` en r8-site). |

---

### Problema 3.7 — Promos: `DELETED`, listado admin, dashboard

| Mito | Realidad |
|------|----------|
| Estado `DELETED` | **No existe** — `DELETE /promos/:id` borra la fila (hard delete) |
| `GET /promos` para label | **Solo admin** — label usa **`GET /promos/for-label?labelId=`** |
| Solo una ruta de dashboard | También existe `GET /promos/dashboard/:labelId`; r8-site usa **`for-label`** para lista/dashboard label |

| Solución | Equipos 2 y 4: mismo endpoint que el web para listados label. |

---

### Problema 3.8 — Detalle de promo vs audio para el player

`GET /promos/:id` devuelve release **slim** (sin tracks para reproducir en muchos casos).

Para el reproductor, el flujo habitual es:

1. `GET /promos/:id?token=` (o inbox)
2. Tomar `release.id`
3. **`GET /releases/:releaseId?token=`** → `tracks[].audioUrl`, `coverUrl`

| Solución | Equipo 3: no asumir que un solo GET de promo alcanza para el player completo. |

---

### Problema 3.9 — Feedback: formas de respuesta distintas

| Ruta | Forma de respuesta |
|------|-------------------|
| `GET /feedback` (label) | `{ "feedback": [...], "total": number }` — **no** array plano |
| `GET /releases/:releaseId/feedback` | `{ "summary", "total", "items" }` |
| `GET /feedback/liked-tracks` | Array agrupado por release |
| `PATCH /feedback/track-stats/downloaded` | Batch de descargas (array con `user_id`, `release_id`, `tracks[]`) |

Campos **`favoriteTrackId`** y **`genre`** en feedback: **no están** en los DTOs actuales de create/update — no enviarlos.

| Solución | Parsear según tabla; copiar lógica de `r8-site/src/api/feedback.ts`. |

---

### Problema 3.10 — Destinatarios: no confundir con `/recipients`

El panel label **no** usa un router CRUD `/recipients` en la API actual.

Flujo correcto:

- Pool: `GET /recipient-lists/recipients`
- Listas: `GET /recipient-lists`, CRUD en `/recipient-lists/:listId`
- Alta en lista: `POST .../recipients` → respuesta **`{ "recipientId": "uuid" }`**

Índice de listas incluye **`deliverySummary`** y por lista **`hasNonValidMailRecipients`**.

---

### Problema 3.11 — Subida de archivos (artwork, audio, avatar)

Patrón universal en R8:

```text
1. POST/PUT presign en API  →  uploadUrl + path
2. PUT binario a uploadUrl
3. POST .../confirm con { path }
```

Audio: en presign de track se puede enviar **`expectedSize`** (bytes); si excede cuota → **409** `RELEASE_AUDIO_QUOTA_EXCEEDED`.

Borrado artwork: `DELETE /releases/:releaseId/files/artwork` (no confundir con `:fileId` genérico en todos los casos).

---

### Problema 3.12 — Token promo `?token=` y rol guest

Muchas rutas de receptor aceptan **`?token=<jwt_contacto>`** sin Bearer:

- `GET /promos/inbox`, `GET /promos/:id`, `POST /promos/:id/dismiss` (→ **204**)
- Feedback bajo `/releases/:releaseId/feedback/...`
- `GET /feedback/liked-tracks`

El middleware asigna rol **`guest`**. El token debe estar **habilitado** (`token_enabled`).

| Solución | En `apiClient`, helper para append `token` a query string; no mezclar con “login de artista” sin diseño. |

---

## 4. Autenticación: tema abierto (cookies en React Native)

### Problema 4.1 — Refresh con cookie httpOnly

Web (`r8-site`): `credentials: 'include'` en login/register/refresh.

React Native **no** trae cookies automáticamente como el navegador.

| Por qué importa | Sin refresh, el `accessToken` expira y la app parece “desloguearse” sola. |
| Solución acordada (a definir en detalle con el profe) | Opciones habituales: (A) librería de cookies + `credentials` en fetch, (B) almacenar refresh token si el curso expone política alternativa, (C) para **primeras entregas**, relogin manual aceptable si se documenta. **Mínimo para la clase:** guardar `accessToken` en memoria/secure store y enviar `Authorization: Bearer` en `apiClient`. Implementar refresh en sprint siguiente a login. |
| Referencia | REFERENCIA_API § Auth; `r8-site/src/utils/api.ts` |

---

## 5. Qué debe hacer cada equipo después de esta clase

Tabla orientativa (no sustituye los `EQUIPO_*`; los actualizará el docente).

| Equipo | Prioridad inmediata | Evitar |
|--------|---------------------|--------|
| **1 — Auth / Artist** | Splash + login stage + dev role toggle; alinear DTOs auth | Recrear `App.tsx`; rutas `/labels/.../releases` |
| **2 — Label lectura** | `GET /users/me`, `/labels/me`, `/promos/for-label`, `/releases` | Asumir array plano en releases |
| **3 — Player** | Inbox + token + `GET /releases/:id` para audio | Un solo GET promo para player completo |
| **4 — Releases/Promos** | Tipos `EP/VA/ALBUM`, presign artwork/tracks | `REMIX`, `bulk-upload`, `GET /promos` global |
| **5 — Lists/Feedback** | `recipient-lists` + `batch`; feedback `{ feedback, total }` | Router `/recipients`; multipart CSV al API |
| **Transversal** | PR pequeño: atoms + `constants/design` + `apiClient` base | PR gigante con 10 pantallas sin compilar |

---

## 6. Ejercicio opcional en repo (15–20 min, en parejas)

Sin obligación de merge; sirve para validar comprensión.

### Qué

En una rama `chore/clase-3b-checklist`, cada pareja completa **solo** esta tabla en un comentario de PR o en el cuaderno:

| # | Pregunta | Respuesta en una línea |
|---|----------|------------------------|
| 1 | URL base de stage | |
| 2 | Endpoint listado promos del label | |
| 3 | ¿Dónde van los design tokens? | |
| 4 | ¿Qué hacer con un CSV de emails? | |
| 5 | Enum válido de `release.type` | |
| 6 | ¿Qué devuelve `GET /feedback`? | |

### Solución (para el profe)

| # | Respuesta esperada |
|---|------------------|
| 1 | `https://api-stage.technopremieres.com` |
| 2 | `GET /promos/for-label?labelId=<uuid>` |
| 3 | `src/constants/design.ts` |
| 4 | Parsear en cliente → `POST .../recipients/batch` con `recipients[]` |
| 5 | `EP`, `VA` o `ALBUM` |
| 6 | Objeto `{ feedback: [], total: n }` |

---

## 7. Checklist post-clase (docente)

Usar después de explicar en vivo; guía la actualización del resto de la documentación.

- [ ] Actualizar `README.md` y `_INIT.md` (entrypoint `index.tsx`, navegación, URL stage, enlaces).
- [ ] Refrescar sección 0 de `CLASE_03_PRACTICA.md` o añadir nota “ver CLASE_03_PRACTICA_B”.
- [ ] Alinear `EQUIPO_1` … `EQUIPO_5` con DTOs corregidos (batch, enums release, feedback).
- [ ] Actualizar `CLASE_02_PRACTICA_B` nota sobre `design/tokens` → `constants/design` (o aviso de legado).
- [ ] Decidir y documentar estrategia refresh/cookies en mobile.
- [ ] Decidir tabs vs stacks solo (UX).
- [ ] Coordinar PR transversal apiClient + atoms a `main`.

---

## 8. Referencias rápidas

| Tema | Archivo |
|------|---------|
| Rutas y flujos | [REFERENCIA_API_R8.md](../REFERENCIA_API_R8.md) |
| Cuerpos JSON y enums | [DTOs_Y_CUERPOS_HTTP.md](../DTOs_Y_CUERPOS_HTTP.md) |
| Pantallas y rutas mobile | [screens.md](../screens.md) |
| Plan por fases | [PLAN_TRABAJO_ALUMNOS_RN.md](../PLAN_TRABAJO_ALUMNOS_RN.md) |
| Capas UI | [ATOMIC_DESIGN.md](../ATOMIC_DESIGN.md) |
| Cliente web referencia | `r8-site/src/api/` |
| Contrato backend (opcional docentes) | `r8-api/docs/MODULES.md` |

---

## 9. Resumen en una frase

**Unificar convenciones de carpeta y tokens, leer el contrato HTTP nuevo antes de codear servicios, integrar en PRs chicos sobre `main`, y tratar `REFERENCIA_API_R8.md` + `DTOs_Y_CUERPOS_HTTP.md` como la ley hasta que el resto de la documentación del repo termine de ponerse al día.**

---

*Documento para la cátedra — Práctica 3B, alineación post-revisión r8-api / r8-site (2026-06-17).*

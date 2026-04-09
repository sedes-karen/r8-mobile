# Referencia HTTP — alineación con r8-site y r8-api

**Versión:** 2026-04-09 (revisión documental)  
**Propósito:** Esta app móvil debe ofrecer las **mismas capacidades funcionales** que el front web **r8-site** (`src/app/router.tsx`). El backend es **r8-api** (Express, rutas explícitas). La documentación antigua asumía recursos anidados bajo `/labels/:labelId/...`; el contrato vigente usa **prefijos por dominio** y el **tenant (label / usuario)** lo resuelve el **JWT** y los middlewares, no la jerarquía REST en la URL.

**DTOs por endpoint (cuerpos JSON, query y enums):** los alumnos deben usar **[DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md)** como referencia principal al consumir la API en **stage** (sin acceso al código del backend).

### Glosario breve

| Término | Significado en este proyecto |
|--------|------------------------------|
| **JWT / accessToken** | Token de acceso de corta duración enviado en `Authorization: Bearer …`. |
| **Tenant** | Contexto de organización (p. ej. label) que el backend deduce del usuario autenticado, no siempre de la URL. |
| **Stage** | Entorno de API de pruebas; la URL base la define la cátedra (no está en este repo). |
| **DTO** | Forma esperada del JSON en request/response; ver tabla en [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md). |

## 1. Qué dejó de aplicar

- No usar como fuente de verdad rutas del estilo `GET /labels/:labelId/releases`, `GET /labels/:labelId/releases/promos`, `GET /labels/:labelId/recipient-lists`, etc.
- El listado global de promos `GET /promos` es **solo administración** en la API; el **label** usa `GET /promos/for-label` (ver abajo).
- Para el **panel label** (como en r8-site), contactos y listas se gestionan con **`/recipient-lists/...`**. Existen rutas bajo **`/recipients`** orientadas a **administración** u otros flujos; no deben confundirse con el flujo del label documentado para los equipos 4–5.

## 2. Autenticación (igual contrato que el web)

- **Login / registro:** `POST /auth/login`, `POST /users/register` devuelven **`accessToken`** (JWT de corta duración). Guardarlo de forma segura en el cliente móvil.
- **Refresh:** `POST /auth/refresh` usa cookie httpOnly; en **React Native** hay que configurar el cliente HTTP para **enviar y persistir cookies** (o el mecanismo que defina el curso con el backend) igual que el web (`credentials: 'include'` en fetch del navegador).
- **Requests autenticados:** header `Authorization: Bearer <accessToken>`.
- **Perfil:** `GET /users/me` (tras login o refresh). Opcionalmente `POST /auth/validate` o `GET /auth/me` con Bearer (en la API actual van pensados para **usuario de app**, no admin global; ver `r8-api` si el curso incluye admins).
- **Logout:** `POST /auth/logout`.
- **Cambio de contraseña (logueado):** `PUT /users/me/change-password`.
- **Reset por email:** `POST /users/password/request-reset`, `POST /users/password/reset` (sin Bearer; mismo contrato que `r8-site` → `src/api/user.ts`).

## 3. Mapa de prefijos (resumen)

| Dominio | Prefijo principal | Notas |
|--------|-------------------|--------|
| Auth | `/auth` | login, refresh, logout, validate |
| Usuario | `/users` | `/me`, registro, password |
| Label (propio) | `/labels/me`, `/labels` | Perfil del sello; imágenes bajo `/labels/me/profile-image` (+ `PUT` a URL firmada + `POST .../confirm`) |
| Artista (propio) | `/artists/me` | Perfil; imagen `/artists/me/profile-image` (+ upload + confirm) |
| Releases | `/releases` | Lista `GET /releases`, detalle `GET /releases/:releaseId`, CRUD sin `labelId` en el path |
| Artwork / tracks | bajo `/releases/...` | Presign `PUT .../artwork`, confirm `POST .../artwork/confirm`; análogo para tracks |
| Promos | `/promos` | Label: `GET /promos/for-label?labelId=`; inbox: `GET /promos/inbox`; detalle `GET /promos/:id` |
| Listas de audiencia | `/recipient-lists` | Sin prefijo `/labels/...`; tenant por JWT |
| Feedback | `/feedback`, `/releases/:releaseId/feedback` | Label: listados y analytics bajo `/feedback`; receptor: CRUD por release |

## 4. Equivalencia con pantallas de r8-site

Rutas web (React Router) → llamadas típicas:

| Pantalla web | Requests principales |
|--------------|----------------------|
| `/`, splash implícito | Sesión: refresh + `GET /users/me` |
| `/login`, `/register`, `/password-reset` | Auth y password según la sección «Autenticación» de este documento |
| `/dashboard` | `GET /users/me`, `GET /promos/for-label?labelId=<id>` (promos recientes / mismo origen que listado promo) |
| `/profile` (label) | `GET /users/me`, `GET /labels/me`, imagen `GET /labels/me/profile-image`; edición `PUT /labels/me` |
| `/analytics` | `GET /releases`, `GET /feedback` (+ filtros en cliente o query según implementación) |
| `/promo` (lista) | `GET /promos/for-label?labelId=` |
| `/promo/:id`, create/edit | `GET/PATCH/POST /promos/...`, `POST /promos/:id/send`, `POST /promos/:id/cancel` |
| `/releases`, `/releases/:id` | `GET /releases`, `GET /releases/:releaseId` |
| `/releases/create`, `edit` | `POST /releases`, `PATCH /releases/:releaseId`, flujo artwork/tracks con presign |
| `/audience-lists`, `/:id` | `GET /recipient-lists`, `GET /recipient-lists/:listId`, `GET /recipient-lists/:listId/recipients`, `GET /recipient-lists/recipients` (pool) |
| `/recipients` | Pool: `GET /recipient-lists/recipients`; alta en lista: `POST /recipient-lists/:listId/recipients` |
| `/feedback` | `GET /feedback` → cuerpo **`{ "feedback": [...], "total": number }`** (el front web suele usar solo el array); `GET /feedback/pending-count`; `GET /feedback/analytics?dateFrom=&dateTo=` (**ambos** query params para rango); promos cruzadas vía `GET /promos/for-label` si la UI lo necesita |
| `/promos-player` | `GET /promos/inbox`, `GET /promos/inbox/pending-count`, `GET /promos/:id` (query `token` si aplica) |
| `/promo/:id/feedback` | `GET /promos/:id`, feedback: `POST/PATCH /releases/:releaseId/feedback/...`, `PATCH .../track-stats`, `PATCH .../track-stats/liked` |
| Perfil artista (player) | `PUT /artists/me`, imagen vía `/artists/me/profile-image` (POST presign → `PUT` upload → POST confirm) |

## 5. Detalle: Promos (label)

- Listado y dashboard consumen el mismo listado del label: **`GET /promos/for-label?labelId=<uuid>`** (en el código web: `promosService.getDashboard` en `r8-site/src/api/promos.ts`).
- Detalle: **`GET /promos/:id`** (opcional `?token=` para receptor).
- Crear promo: **`POST /promos`** con cuerpo alineado al DTO actual (p. ej. `releaseId`, `sendType`, `recipientListIds`, `scheduledAt` — ver `CreatePromoDto` en `r8-site/src/api/promos.ts`).

## 6. Detalle: Feedback (receptor / artista)

Rutas bajo **`/releases/:releaseId`** (no bajo `/labels/...`):

- Asegurar fila: `POST /releases/:releaseId/feedback` (cuerpo mínimo habitual: **`{ "userId": "<uuid del contacto promo>" }`**; si ya existía fila, la API puede responder **200** con el existente en lugar de **201**).
- Formulario: `PATCH /releases/:releaseId/feedback/:feedbackId`.
- Stats de reproducción: `PATCH .../track-stats` (array de deltas).
- Like por track: `PATCH .../track-stats/liked`.
- Inbox: `POST /promos/:id/dismiss` (query `token` si aplica).

## 7. Detalle: Recipient lists y contactos

- Índice de listas: `GET /recipient-lists?page=&limit=&search=`.
- Detalle lista: `GET /recipient-lists/:listId`.
- Miembros: `GET /recipient-lists/:listId/recipients`.
- Pool del label (búsqueda al agregar): `GET /recipient-lists/recipients`.
- Añadir a lista: `POST /recipient-lists/:listId/recipients` (body con `email` y/o `recipientId`, etc.).
- Quitar: `DELETE /recipient-lists/:listId/recipients/:recipientId`.
- Bulk CSV: `POST /recipient-lists/:listId/recipients/bulk-upload` (multipart).
- Crear/actualizar/eliminar lista: `POST /recipient-lists`, `PUT /recipient-lists/:listId`, `DELETE /recipient-lists/:listId`.

## 8. Lectura extendida

- Contrato completo de módulos: repositorio **r8-api**, `docs/MODULES.md`.
- Implementación de referencia del cliente: **r8-site**, carpetas `src/api/` y `src/utils/api.ts`.

---

*Documento creado en colaboración con Cursor.*

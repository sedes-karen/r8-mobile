# Referencia HTTP — alineación con r8-site y r8-api

**Versión:** 2026-06-30  
**Sincronizado con:** `r8-api` (`docs/MODULES.md` v1.6, 2026-04-21) y cliente web `r8-site` (`src/api/`).  
**Propósito:** La app móvil debe ofrecer las **mismas capacidades funcionales** que **r8-site** (`src/app/router.tsx`), consumiendo **r8-api** (Express). El contrato vigente usa **prefijos por dominio**; el **tenant (label / usuario)** lo resuelve el **JWT** (y en flujos de destinatario, `?token=`), no rutas anidadas del estilo `/labels/:labelId/releases`.

**DTOs, cuerpos JSON y enums por endpoint:** [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

## Entorno Stage (API pública del curso)

| Concepto | Valor |
|----------|--------|
| **URL base** | `https://api-stage.technopremieres.com` |
| **Health check** | `GET https://api-stage.technopremieres.com/health` → **200** si el servicio responde |
| **Variable en Expo** | `EXPO_PUBLIC_API_URL=https://api-stage.technopremieres.com` |

Todas las rutas de este documento son **relativas** a esa base. Ejemplo: login → `POST https://api-stage.technopremieres.com/auth/login`.

> **Nota:** Stage es un entorno compartido de pruebas. No usar para datos sensibles reales ni cargas destructivas masivas.

---

## Glosario breve

| Término | Significado |
|--------|-------------|
| **JWT / accessToken** | Token de acceso de corta duración. Header: `Authorization: Bearer <accessToken>`. |
| **Refresh** | Cookie httpOnly rotada con `POST /auth/refresh` (el navegador la envía con `credentials: 'include'`; en React Native hay que replicar persistencia de cookies — ver notas de auth). |
| **`?token=`** | JWT de contacto promo (usuario `auth_provider: promo`). Habilita rol **`guest`** en middleware sin Bearer. Usado en inbox, detalle de promo, feedback y descargas. |
| **Tenant** | Contexto de label deducido del usuario autenticado, no siempre de la URL. |
| **DTO** | Forma del JSON request/response; detalle en [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md). |
| **Hard delete** | `DELETE` de promo o release **borra la fila** en DB (no hay papelera ni estado `DELETED`). |

---

## Convenciones HTTP para r8-mobile

1. **JSON:** `Content-Type: application/json` en requests con cuerpo (salvo subida binaria directa a URL firmada).
2. **Autenticado (label / artista registrado):** `Authorization: Bearer <accessToken>`.
3. **Destinatario de promo (sin cuenta):** `?token=<jwt_contacto>` en la misma petición (puede coexistir con Bearer en algunos casos; lo habitual es solo token).
4. **Refresh de sesión:** `POST /auth/refresh` con cookie de refresh (sin Bearer obligatorio).
5. **IDs:** UUID en rutas y en la mayoría de campos.
6. **Fechas:** cadenas ISO 8601 en JSON; fechas de release en respuestas suelen venir como `YYYY-MM-DD`.
7. **Errores:** `{ "message": "...", "error": "..." }` u objeto de validación; códigos 400, 401, 403, 404, 409, 410, etc.

### Subida de archivos (artwork, audio, avatar)

Patrón en tres pasos (igual que r8-site):

1. **Presign** al endpoint de la API → respuesta `{ uploadUrl, path, expiresIn, contentType }`.
2. **`PUT` directo** al `uploadUrl` (storage R2/S3) con el binario y el `Content-Type` acordado.
3. **`POST .../confirm`** con `{ "path": "<path del paso 1>" }`.

| Recurso | Presign | Body presign |
|---------|---------|--------------|
| Artwork release | **`PUT`** `/releases/:releaseId/artwork` | `{ "filename", "mimetype"? }` |
| Audio track | **`PUT`** `/releases/:releaseId/tracks/:trackId` | `{ "filename", "mimetype"?, "expectedSize"? }` |
| Avatar label/artist | **`POST`** `/labels/me/profile-image` o `/artists/me/profile-image` | `{ "contentType": string }` |

Las URLs de **lectura** (playback, portada) vienen en `GET /releases/:id` (`coverUrl`, `tracks[].audioUrl`) o en payloads de inbox/detalle de promo — **no** hay `GET /files/*` público.

---

## Alcance para equipos mobile (1–5)

### Incluido en la documentación de este repo

Auth, usuarios, labels, artists, releases (+ artwork/tracks), promos (label + inbox receptor), recipient-lists, feedback (label + receptor).

### Fuera de alcance del curso (no implementar salvo proyecto avanzado)

| Prefijo | Motivo |
|---------|--------|
| `GET /promos` (sin sufijo) | Solo **admin** global |
| `/admins`, `/features`, `/system-settings` | Panel admin |
| `/promo-codes` | Campañas Bandcamp (módulo aparte en r8-site) |
| `/label-features` | Features por label (admin/ops) |
| `/security/tests` | Tests de seguridad internos |
| `POST /mails-queue/webhook` | Webhook SendGrid (servidor) |
| Rutas legacy `PUT /releases/label/:labelId/...` | Sustituidas por `/releases/:releaseId/...` |

---

## 1. Qué dejó de aplicar

- Rutas del estilo `GET /labels/:labelId/releases`, `GET /labels/:labelId/releases/promos`, etc.
- **`GET /promos`** sin más → solo administración; el **label** usa **`GET /promos/for-label`**.
- Router **`/recipients`** como CRUD de label → el flujo label es **`/recipient-lists/...`**; los contactos promo son filas en `users` resueltas por email/token.
- **`POST .../recipients/bulk-upload`** (multipart CSV al servidor) → reemplazado por **`POST .../recipients/batch`** (JSON); el **parseo CSV/Excel es en el cliente** (como en r8-site).
- **`PUT /users/me/change-password`** → la API expone **`POST /users/me/change-password`**.
- **`POST /users/unsubscribe/:userId`** → la API usa **`POST /users/unsubscribe`** (Bearer o contexto de usuario) y **`POST /users/unsubscribe?token=`** vía el mismo middleware de token promo donde aplique.
- Enums de release obsoletos en docs viejos: no usar `REMIX`, `SINGLE`, `PUBLISHED`; ver sección Releases.
- Estado `DELETED` en promos → no existe; el delete es físico.

---

## 2. Autenticación y sesión

| Método | Ruta | Auth | Uso en mobile |
|--------|------|------|----------------|
| `POST` | `/auth/login` | — | Login label/artist |
| `POST` | `/users/register` | — | Registro (`role`: `label` \| `artist`) |
| `POST` | `/auth/refresh` | Cookie refresh | Bootstrap / renovar accessToken |
| `POST` | `/auth/logout` | Cookie (+ Bearer opcional) | Cierre de sesión; body opcional `{ "scope": "all" }` |
| `POST` | `/auth/validate` | Bearer | Validar token (usuario app, no admin) |
| `GET` | `/auth/me` | Bearer | Perfil autenticado (equivalente a validate) |
| `GET` | `/users/me` | Bearer | Perfil enriquecido (`labels`, `artist`, URLs firmadas) |
| `PUT` | `/users/me` | Bearer | Actualizar perfil usuario |
| `POST` | `/users/me/change-password` | Bearer | Cambio de contraseña logueado — revoca cookies refresh |
| `POST` | `/users/password/request-reset` | — | Paso 1 reset por email |
| `POST` | `/users/password/reset` | — | Paso 2 reset (PIN + nueva contraseña); devuelve `accessToken` |
| `GET` | `/users/me/recipient` | Bearer | Vista recipient del usuario |
| `GET` | `/users/recipient-by-token?token=` | — | Contacto promo por token (sin Bearer) |
| `POST` | `/users/unsubscribe` | Bearer (roles artist/label/guest) | Baja de mailing del usuario/contacto |
| `POST` | `/users/resubscribe` | Bearer (roles artist/label/guest) | Reactivar mailing |

**Flujo bootstrap (splash):** `POST /auth/refresh` → si OK, `GET /users/me` → elegir stack Artist o Label según perfil.

**Token promo (`?token=`):** el middleware asigna `guest` y permite inbox, detalle de promo, feedback y dismiss sin cuenta registrada. El token debe tener `token_enabled: true` en el contacto.

### Autenticación en React Native (decisión del curso)

React Native **no** persiste cookies httpOnly como el navegador. El curso adopta un enfoque **por fases**:

| Fase | Alcance | Qué implementar |
|------|---------|-----------------|
| **Sprint login (Fase 0–1)** | Entregas iniciales | Tras `POST /auth/login` o `/users/register`, guardar **`accessToken`** en memoria + **Expo SecureStore** (o equivalente). El `apiClient` envía `Authorization: Bearer <accessToken>` en todas las rutas autenticadas. Si el token expira → **relogin manual** aceptable (documentar en la app). |
| **Sprint refresh (siguiente)** | Sesión persistente | Persistir cookie de refresh con librería de cookies RN (p. ej. `@react-native-cookies/cookies`) y usar `credentials: 'include'` en login, register, refresh y logout — mismo patrón que `r8-site/src/utils/api.ts`. Interceptor: ante **401**, `POST /auth/refresh` → actualizar `accessToken` → reintentar la petición original. |
| **Flujo guest (Equipo 3)** | Receptor sin cuenta | **No** mezclar con login de artista. Usar `?token=<jwt_contacto>` en query; helper en `apiClient` para append del token. Ver § Token promo arriba. |

**Bootstrap (splash):** en el sprint de refresh, la pantalla inicial llama `POST /auth/refresh` con la cookie guardada; si falla → stack Auth (Login). Hasta tener refresh, el splash puede ir directo a Login.

**Desarrollo sin login real:** menú o flag dev que setee `{ isAuthenticated: true, role: 'label' | 'artist' }` en `AuthInfoProvider` para probar stacks Label/Artist (ver [CLASE_03_PRACTICA_B.md](./_Clases_Practicas/CLASE_03_PRACTICA_B.md)).

---

## 3. Catálogo por dominio (endpoints mobile)

### Labels (`/labels`)

| Método | Ruta | Notas |
|--------|------|--------|
| `POST` | `/labels` | Crear label |
| `GET` | `/labels` | Labels del usuario |
| `GET` | `/labels/me` | Label primario |
| `PUT` | `/labels/me` | Editar perfil label |
| `GET/POST/POST .../confirm` | `/labels/me/profile-image` (+ `/confirm`) | Avatar (presign + upload + confirm) |
| `GET/PUT/DELETE` | `/labels/:id` (+ profile-image) | CRUD por id (admin u operación autorizada) |

### Artists (`/artists`)

| Método | Ruta | Notas |
|--------|------|--------|
| `POST` | `/artists` | Crear perfil (si no existe tras registro) |
| `GET` | `/artists/me` | Perfil artista |
| `PUT` | `/artists/me` | Editar perfil |
| `DELETE` | `/artists/me` | Eliminar perfil |
| `GET/POST/POST .../confirm` | `/artists/me/profile-image` (+ `/confirm`) | Avatar |
| `GET` | `/artists/me/label-unsubscriptions` | Labels de los que el artista se dio de baja de futuras promos |
| `POST` | `/artists/me/label-unsubscriptions/:labelId` | Baja de promos futuras de un label |
| `DELETE` | `/artists/me/label-unsubscriptions/:labelId` | Rehabilitar promos de ese label |

### Releases (`/releases`)

| Método | Ruta | Notas |
|--------|------|--------|
| `GET` | `/releases/all` | Público: releases en estado **CREATED** |
| `GET` | `/releases` | Lista del label del JWT → `{ releases, hostingQuota: { used }, releaseAudioQuota }` — `used` = conteo de releases con audio, no bytes |
| `POST` | `/releases` | Crear (label asignado por servidor) |
| `GET` | `/releases/:releaseId` | Detalle; `?token=` para receptor; incluye `coverUrl`, `tracks[].audioUrl` |
| `PATCH` | `/releases/:releaseId` | Actualizar |
| `DELETE` | `/releases/:releaseId` | Hard delete; **409** si hay promos activas |
| `PUT` | `/releases/:releaseId/artwork` | Presign artwork |
| `POST` | `/releases/:releaseId/artwork/confirm` | Confirmar artwork |
| `PUT` | `/releases/:releaseId/tracks/:trackId` | Presign audio (`expectedSize` opcional) |
| `POST` | `/releases/:releaseId/tracks/:trackId/confirm` | Confirmar audio |
| `GET` | `/releases/:releaseId/files` | Metadatos de archivos |
| `GET/DELETE` | `/releases/:releaseId/files/:fileId` | Metadato / borrar (`fileId` puede ser `artwork` o UUID de track) |

**Tipos:** `type` → `EP` \| `VA` \| `ALBUM`. **Estados:** `DRAFT` \| `CREATED` (publicado para promos, no “público web”). **Formatos opcionales:** `DIGITAL` \| `VINYL`.

### Promos (`/promos`)

| Método | Ruta | Rol / auth | Notas |
|--------|------|------------|--------|
| `GET` | `/promos/for-label?labelId=` | Label (Bearer) | Listado completo del label; **usado por r8-site** en dashboard y lista |
| `GET` | `/promos/dashboard/:labelId` | Label o artist (Bearer) | Variante dashboard (artista ve sus promos recibidas) |
| `GET` | `/promos/inbox` | Artist/guest | Inbox receptor; `?token=`, `?no-feedback-only=true` |
| `GET` | `/promos/inbox/pending-count` | Artist/guest | `{ count }` |
| `GET` | `/promos/:id` | Artist/label/guest | Detalle; `?token=`; payload **slim** (sin tracks en detalle estándar — ver DTOs) |
| `POST` | `/promos` | Label* | Crear — *la ruta admite `artist`, pero el servidor exige ownership del label del release → artista sin label propio recibe **403** |
| `PATCH` | `/promos/:id` | Label | Editar (típicamente solo `DRAFT`) |
| `DELETE` | `/promos/:id` | Label | Hard delete; solo `DRAFT` o `SCHEDULED` con ventana |
| `POST` | `/promos/:id/send` | Label | Envío manual |
| `POST` | `/promos/:id/cancel` | Label | Cancelar programada |
| `POST` | `/promos/:id/dismiss` | Guest / `?token=` | **204** — con Bearer el JWT debe incluir rol **`guest`** (contactos promo); con **`?token=`** el middleware omite el chequeo de rol |

**Estados de promo (lectura):** `DRAFT`, `SCHEDULED`, `SENDING`, `SENT`, `CANCELLED`, `FAILED`, `EXPIRED`.

### Recipient lists (`/recipient-lists`)

Tenant por JWT; **sin** `:labelId` en la URL.

| Método | Ruta | Notas |
|--------|------|--------|
| `GET` | `/recipient-lists/recipients` | Pool de contactos del label |
| `GET` | `/recipient-lists` | `?page&limit&search` → `{ lists, total, deliverySummary }`; cada lista incluye `hasNonValidMailRecipients` |
| `POST` | `/recipient-lists` | Crear `{ name }` |
| `GET` | `/recipient-lists/:listId` | Detalle |
| `PUT` | `/recipient-lists/:listId` | Actualizar nombre y/o `recipientIds` |
| `DELETE` | `/recipient-lists/:listId` | **204**; **409** con dependencias |
| `GET` | `/recipient-lists/:listId/recipients` | Miembros |
| `POST` | `/recipient-lists/:listId/recipients` | Alta por `email` y/o `recipientId` → `{ recipientId }` |
| `DELETE` | `/recipient-lists/:listId/recipients/:recipientId` | Quitar de la lista |
| `POST` | `/recipient-lists/:listId/recipients/batch` | Alta masiva JSON (`recipientIds` **o** `recipients[]`) |

### Feedback

**Ámbito label** — prefijo `/feedback` (sin `:labelId` en URL):

| Método | Ruta | Notas |
|--------|------|--------|
| `GET` | `/feedback` | `{ feedback, total }` + filtros query (**sin** `dateFrom`/`dateTo`) |
| `GET` | `/feedback/pending-count` | `{ count }` |
| `GET` | `/feedback/analytics` | `?dateFrom=&dateTo=` (**ambos** para rango) |
| `GET` | `/feedback/:feedbackId` | Detalle — label dueño del release o **propio recipient** |
| `GET` | `/feedback/liked-tracks` | Favoritos agrupados por release; `?token=` |
| `PATCH` | `/feedback/track-stats/downloaded` | Marcar descargas en lote (receptor) |

**Por release** — `/releases/:releaseId/feedback`:

| Método | Ruta | Notas |
|--------|------|--------|
| `GET` | `/releases/:releaseId/feedback` | Label dueño → `{ summary, total, items }` |
| `POST` | `/releases/:releaseId/feedback` | Ensure/create receptor → **200** existente o **201** nuevo |
| `GET` | `/releases/:releaseId/feedback/:feedbackId` | Detalle (dueño) |
| `PATCH` | `/releases/:releaseId/feedback/:feedbackId` | Formulario receptor — **solo primera entrega** (`rating` era `null`) |
| `PATCH` | `.../track-stats` | Array de deltas reproducción |
| `PATCH` | `.../track-stats/liked` | `{ track_id, liked }` |
| `PATCH` | `.../track-stats/downloaded` | `{ track_id }` (un track; preferir batch global) |

---

## 4. Equivalencia pantallas r8-site → requests

| Pantalla web (`r8-site`) | Requests principales |
|--------------------------|----------------------|
| `/` (splash) | `POST /auth/refresh`, `GET /users/me` |
| `/login`, `/register`, `/password-reset` | Sección Auth |
| `/dashboard` | `GET /users/me`, `GET /promos/for-label?labelId=<id>` |
| `/profile` (label) | `GET /users/me`, `GET /labels/me`, `GET /labels/me/profile-image`, `PUT /labels/me` |
| `/analytics` | `GET /releases`, `GET /feedback`, `GET /feedback/analytics?dateFrom=&dateTo=` |
| `/promo` (lista) | `GET /promos/for-label?labelId=` |
| `/promo/:id`, create/edit | `GET/PATCH/POST /promos/...`, `POST .../send`, `POST .../cancel` |
| `/releases`, `/releases/:id` | `GET /releases`, `GET /releases/:releaseId` |
| `/releases/create`, edit | `POST/PATCH /releases`, presign artwork/tracks |
| `/audience-lists`, `/:id` | `GET /recipient-lists`, `GET /recipient-lists/:listId`, `GET .../recipients`, `GET /recipient-lists/recipients` |
| `/recipients` | Pool: `GET /recipient-lists/recipients`; alta: `POST /recipient-lists/:listId/recipients` o `.../batch` |
| `/feedback` | `GET /feedback`, `GET /feedback/pending-count`, `GET /feedback/analytics` |
| `/promos-player` | `GET /promos/inbox`, `GET /promos/inbox/pending-count`, `GET /promos/:id?token=` |
| `/promo/:id/feedback` | `GET /promos/:id`, `POST/PATCH /releases/:releaseId/feedback/...`, track-stats |
| Perfil artista (player) | `GET/PUT /artists/me`, imagen `/artists/me/profile-image` |
| Liked tracks | `GET /feedback/liked-tracks?token=` |
| Bulk upload destinatarios (web) | Cliente parsea CSV → `POST .../recipients/batch` con `{ recipients: [{ email, display_name? }] }` |

---

## 5. Detalle: flujos críticos

### 5.1 Promos (label)

- Listado operativo: **`GET /promos/for-label?labelId=<uuid>`** (mismo origen que `promosService.getDashboard` en r8-site).
- Crear: **`POST /promos`** con `releaseId`, `sendType`, `recipientListIds`, `scheduledAt` si aplica.
- Eliminar: solo en estados permitidos; tras delete la promo desaparece de listados.

### 5.2 Inbox y player (receptor / artista)

- Listado: **`GET /promos/inbox`** con Bearer (artista con `recipientId`) o **`?token=`** (contacto promo).
- Cada ítem puede traer `release.tracks[].src` para audio en inbox.
- Pending: **`GET /promos/inbox/pending-count`**.
- Dismiss: **`POST /promos/:id/dismiss`** → **204** (rol guest / token).
- Detalle para reproductor: **`GET /promos/:id`**; para tracks completos con audio suele usarse **`GET /releases/:releaseId?token=`** tras resolver `release.id` desde la promo.

### 5.3 Feedback (receptor)

1. **Ensure:** `POST /releases/:releaseId/feedback` con `{ "userId": "<uuid>" }` — `userId` debe ser el contacto **logueado** (Bearer o `?token=`). **200** si ya existía; **201** si se creó.
2. **Formulario:** `PATCH .../feedback/:feedbackId` con `rating`, `comment`, `willPlay`, `supported` — **solo persiste si aún no había `rating`** (un solo envío).
3. **Reproducción:** `PATCH .../track-stats` (array de deltas).
4. **Like:** `PATCH .../track-stats/liked`.
5. **Descarga:** `PATCH /feedback/track-stats/downloaded` (batch recomendado) o `PATCH .../track-stats/downloaded` (un track).

**Dos listados distintos:** `GET /feedback` (label) devuelve entidades `Feedback` crudas; `GET /releases/:releaseId/feedback` devuelve `{ summary, total, items }` con `recipient` anidado por ítem.

### 5.4 Recipient lists y carga masiva

- La pantalla mobile **BulkUpload** debe **parsear el archivo en el dispositivo** y llamar a **`POST /recipient-lists/:listId/recipients/batch`**.
- Enviar **exactamente uno** de: `recipientIds[]` **o** `recipients: [{ email, display_name? }]`.
- Respuesta batch: `{ added: [{ recipientId, email }], skipped: number }`.

### 5.5 Errores frecuentes

| Código | Situación |
|--------|-----------|
| **401** | Token ausente o inválido |
| **403** | Rol incorrecto, token promo deshabilitado, sin acceso al release |
| **404** | Recurso inexistente o promo/release no visible para el receptor |
| **409** | Delete con dependencias (`DELETE_DEPENDENCY_ERROR`), cuota de audio (`RELEASE_AUDIO_QUOTA_EXCEEDED`) |
| **410** | Release/promo ya no disponible (`RELEASE_GONE`) |

---

## 6. Lectura extendida (docentes / opcional)

- Contrato completo de módulos: repositorio **r8-api**, `docs/MODULES.md`.
- Cliente de referencia: **r8-site**, `src/api/` y `src/utils/api.ts`.
- DTOs para alumnos sin acceso al backend: [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

*Documento sincronizado con r8-api y r8-site — 2026-06-30.*

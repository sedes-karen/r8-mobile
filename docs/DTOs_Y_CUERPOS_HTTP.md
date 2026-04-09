# DTOs y cuerpos HTTP — API pública (stage)

**Audiencia:** alumnos **sin acceso al código** de r8-api; consumirán la API desplegada en **stage** (URL base provista por la cátedra).

**Convenciones generales**

- **Content-Type:** `application/json` en casi todas las peticiones con cuerpo (excepto subida de archivos CSV/XLS indicada abajo).
- **Autenticación:** header `Authorization: Bearer <accessToken>` cuando el endpoint lo requiera. Login y registro devuelven `accessToken` en el JSON; el **refresh** suele depender de **cookie** httpOnly (`POST /auth/refresh` con `credentials` / equivalente en el cliente móvil).
- **IDs:** UUID en rutas y en muchos campos (salvo donde se indique otro formato).
- **Fechas en JSON:** cadenas ISO 8601 (p. ej. `2026-04-09T12:00:00.000Z`). El servidor puede validarlas y transformarlas internamente.
- **Errores:** cuerpos típicos `{ "message": "...", "error": "..." }` o mensaje según middleware; códigos HTTP estándar (400, 401, 403, 404, 409, etc.).

> **Nota:** Si un campo no aparece en el DTO de una petición, no lo envíes salvo que el equipo verifique en stage que el servidor lo acepta (whitelist en validación). Los **enums** listados aquí son los del backend actual; ante duda, probá en stage o contrastá con la respuesta de un GET.

---

## 1. Auth (`/auth`)

| Método | Ruta | Cuerpo (request) | Respuesta (resumen) |
|--------|------|-------------------|------------------------|
| `POST` | `/auth/login` | `{ "email": string, "password": string }` | `{ "success": true, "user": <perfil>, "accessToken": string }` |
| `POST` | `/auth/refresh` | (vacío; cookie de refresh) | `{ "success": true, "accessToken": string }` |
| `POST` | `/auth/logout` | Opcional: `{ "scope": "all" }` para cerrar todas las sesiones | `{ "success": true }` |
| `POST` | `/auth/validate` | — (Bearer obligatorio) | Perfil / validación de token (misma idea que identidad del usuario) |
| `GET` | `/auth/me` | — | Igual que `POST /validate` con GET (misma política de auth en la API actual) |

> **Nota:** En r8-api, `POST /auth/validate` y `GET /auth/me` exigen usuario **no admin** (`requireNonAdminUser`). Los flujos solo-admin no usan estas rutas como el resto de la app label/artista.

---

## 2. Usuarios (`/users`)

| Método | Ruta | Cuerpo (request) | Respuesta (resumen) |
|--------|------|-------------------|------------------------|
| `POST` | `/users/register` | Ver **RegisterBody** abajo | **201** `{ "success": true, "user": <perfil>, "accessToken": string }` |
| `GET` | `/users/me` | — | Objeto usuario enriquecido (incluye `labels`, `artist` anidados cuando aplica; URLs de imagen firmadas cuando existen). |
| `PUT` | `/users/me` | **UpdateUserDto** | Usuario actualizado |
| `PUT` | `/users/me/change-password` | `{ "currentPassword": string, "newPassword": string }` | `{ "message": "Password changed successfully" }` |
| `GET` | `/users/me/recipient` | — | Vista “recipient” del usuario (email, displayName, flags, etc.) |
| `GET` | `/users/recipient-by-token?token=<jwt>` | — | Datos del contacto promo asociado al token (sin Bearer) |
| `POST` | `/users/password/request-reset` | `{ "email": string }` | `{ "message": "If an account exists..." }` |
| `POST` | `/users/password/reset` | **ResetPasswordDto** | `{ "message": string, "accessToken": string }` |
| `POST` | `/users/unsubscribe/:userId` | — | **204** (identificador = usuario contacto, UUID) |

### RegisterBody (`POST /users/register`)

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|--------|
| `email` | string | sí | |
| `password` | string | sí | |
| `role` | `"label"` \| `"artist"` | sí | No se admite `"both"` en un solo paso. |
| `labelName` | string | no | Si `role === "label"` (default generado si falta). |
| `artistName`, `firstName`, `lastName` | string | no | Si `role === "artist"`. |

### UpdateUserDto (`PUT /users/me`)

Todos opcionales (al menos uno presente):  
`fullName`, `bandcampUrl`, `soundcloudUrl`, `instagramUrl`, `labelId`, `token_enabled`, `display_name`, `country` (validación de URL en campos de enlace cuando aplica).

### ResetPasswordDto (`POST /users/password/reset`)

| Campo | Tipo | Notas |
|-------|------|--------|
| `email` | string | |
| `pin` | string | **4 caracteres** (PIN del email) |
| `newPassword` | string | mínimo **6** caracteres |
| `confirmPassword` | string | debe coincidir con `newPassword` |

---

## 3. Labels (`/labels`)

| Método | Ruta | Cuerpo | Respuesta (resumen) |
|--------|------|--------|----------------------|
| `POST` | `/labels` | `{ "name": string }` | Label creado **201** |
| `GET` | `/labels` | — | Lista de labels del usuario |
| `GET` | `/labels/me` | — | Label “propio” (primario) |
| `PUT` | `/labels/me` | **UpdateLabelDto** | Label actualizado |
| `GET` | `/labels/me/profile-image` | — | `{ "url": string \| null, "expiresAt"?: string }` |
| `POST` | `/labels/me/profile-image` | `{ "contentType": string }` | **201** `{ "uploadUrl", "expiresIn", "path" }` → luego `PUT` al storage y `POST .../confirm` |
| `POST` | `/labels/me/profile-image/confirm` | `{ "path": string }` | **201** metadatos de confirmación |
| `GET` | `/labels/:id` | — | Label (acceso según middleware) |
| `PUT` | `/labels/:id` | **UpdateLabelDto** | Actualizado |
| `DELETE` | `/labels/:id` | — | **204** |
| `POST/GET/...` | `/labels/:id/profile-image` | Igual patrón que `/me` para operar sobre otro `id` (admin u operaciones autorizadas) | |

### UpdateLabelDto (`PUT /labels/me` o `PUT /labels/:id`)

Opcionales: `name`, `bandcampUrl`, `soundcloudUrl`, `instagramUrl`, `twitterUrl`, `description`, `profileImagePath` (en flujo normal de imagen se actualiza vía confirm, no manual).

---

## 4. Artistas (`/artists`)

| Método | Ruta | Cuerpo | Respuesta |
|--------|------|--------|-----------|
| `POST` | `/artists` | **CreateArtistDto** | **201** artista |
| `GET` | `/artists/me` | — | Entidad artista |
| `PUT` | `/artists/me` | **UpdateArtistDto** | Actualizado |
| `DELETE` | `/artists/me` | — | **204** |
| `POST` | `/artists/me/profile-image` | `{ "contentType": string }` | **201** presign + `path` |
| `POST` | `/artists/me/profile-image/confirm` | `{ "path": string }` | **201** |
| `GET` | `/artists/me/profile-image` | — | `{ "url": string \| null, "expiresAt"?: ... }` |

### CreateArtistDto

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| `first_name` | string | sí |
| `last_name` | string | sí |
| `artist_name` | string | no |
| `bio` | string | no |

### UpdateArtistDto

Opcionales: `first_name`, `last_name`, `artist_name`, `bio`, `instagramUrl`, `soundcloudUrl`, `bandcampUrl`, `twitterUrl`, `profileImagePath`.

---

## 5. Releases (`/releases`)

### 5.1 CRUD y lectura

| Método | Ruta | Cuerpo / query | Respuesta |
|--------|------|----------------|-----------|
| `GET` | `/releases/all` | — | Listado público de publicados |
| `GET` | `/releases` | — | Releases del label del usuario (tenant por JWT) |
| `POST` | `/releases` | **CreateReleaseUnderLabelDto** | **201** release creado (el servidor asigna `labelId`) |
| `GET` | `/releases/:releaseId` | Query opcional `?token=` para acceso tipo destinatario | Release + `coverUrl`, `tracks[].audioUrl`, `releaseLinks`, `promos` según carga |
| `PATCH` | `/releases/:releaseId` | **UpdateReleaseDto** | Release actualizado |
| `DELETE` | `/releases/:releaseId` | — | **204** |
| `GET` | `/releases/:releaseId/files` | — | Lista de descriptores de archivos |
| `GET` | `/releases/:releaseId/files/:fileId` | — | Metadato de un archivo |
| `DELETE` | `/releases/:releaseId/files/:fileId` | — | **204** |

### CreateReleaseUnderLabelDto (`POST /releases`)

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|--------|
| `title` | string | sí | |
| `artist` | string | sí | |
| `releaseDate` | string | sí | Formato validado en servidor |
| `type` | enum | no | **`EP` \| `ALBUM` \| `REMIX`** (default típico `EP`). **No** usar valores que solo existan en el cliente web (p. ej. `SINGLE`) si la API en stage los rechaza: el enum del backend es la fuente de verdad. |
| `catalogNumber` | string | no | máx. 10 caracteres |
| `notes` | string | no | |
| `tracks` | **CreateTrackDto[]** | no | |

### CreateTrackDto (dentro de `tracks`)

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| `title` | string | sí |
| `trackNumber` | number (≥ 1) | sí |
| `duration` | number (≥ 1) | no | segundos |

### UpdateReleaseDto (`PATCH /releases/:releaseId`)

Todos los campos opcionales: `title`, `artist`, `artistId`, `artistEmail`, `releaseDate`, `type` (**`EP` \| `ALBUM` \| `REMIX`**), `catalogNumber` (string o `null`), `status` (**`DRAFT` \| `PUBLISHED`**), `notes`, `tracks` (objetos con `id`, `title`, `artist`, `trackNumber` opcionales), `releaseLinks` (objetos con `id`, `title`, `url`, `position`, `delete`).

### 5.2 Artwork y audio (presign + confirmación)

Rutas reales (sin `labelId` en el path; el acceso al release valida que el label del JWT sea dueño):

**Solicitar subida de artwork**

`PUT /releases/:releaseId/artwork`

Cuerpo: `{ "filename": string, "mimetype"?: string }`

Respuesta: `{ "uploadUrl", "expiresIn", "path", "contentType" }` → el cliente hace **PUT** binario a `uploadUrl` con `Content-Type` indicado.

**Confirmar artwork**

`POST /releases/:releaseId/artwork/confirm`

Cuerpo: `{ "path": string }` (el `path` devuelto en el paso anterior).

Respuesta típica incluye `streamUrl` / metadatos según controller (confirmación + URL firmada de lectura).

**Vista / descarga del artwork en la app:** suele obtenerse ya como **`coverUrl`** en **`GET /releases/:releaseId`** (no hace falta un GET aparte solo para artwork salvo que usen metadatos vía `GET /releases/:releaseId/files`).

**Audio de track**

- `PUT /releases/:releaseId/tracks/:trackId` con `{ "filename", "mimetype?" }` → presign.
- `POST /releases/:releaseId/tracks/:trackId/confirm` con `{ "path" }`.
- Las URLs de reproducción suelen venir en **`tracks[].audioUrl`** en **`GET /releases/:releaseId`**.

---

## 6. Promos (`/promos`)

| Método | Ruta | Query / cuerpo | Respuesta |
|--------|------|----------------|-----------|
| `GET` | `/promos/for-label` | `?labelId=<uuid>` obligatorio si el usuario tiene **varios** labels; si tiene uno solo, puede omitirse | Array de DTOs de listado (incluye `release`, `recipientLists`, `coverUrl` en release cuando aplica) |
| `GET` | `/promos/inbox` | `?token=` (acceso destinatario sin sesión), `?no-feedback-only=true` opcional | Lista de promos inbox |
| `GET` | `/promos/inbox/pending-count` | `?token=` opcional | `{ "count": number }` |
| `GET` | `/promos/:id` | `?token=` opcional | Detalle promo + release enriquecido |
| `POST` | `/promos` | **CreatePromoDto** | **201** promo |
| `PATCH` | `/promos/:id` | **UpdatePromoDto** | Actualizado |
| `DELETE` | `/promos/:id` | — | **204** / según política |
| `POST` | `/promos/:id/send` | — | Envío manual |
| `POST` | `/promos/:id/cancel` | — | Cancelación |
| `POST` | `/promos/:id/dismiss` | `?token=` opcional | **204** (sale del inbox del destinatario) |
| `GET` | `/promos` | — | **Solo admin** — listado global |

### CreatePromoDto (`POST /promos`)

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|--------|
| `releaseId` | UUID | sí | |
| `sendType` | **`IMMEDIATE`** \| **`SCHEDULED`** | sí | |
| `scheduledAt` | string (ISO fecha) | condicional | Obligatorio si `sendType === "SCHEDULED"` |
| `recipientListIds` | UUID[] | no | UUID v4 por elemento |
| `useCuratedDb` | boolean | no | default `false` |
| `expiresAt` | string ISO | no | |

### UpdatePromoDto (`PATCH /promos/:id`)

Opcionales: `scheduledAt`, `useCuratedDb`, `sendType` (enum **PromoSendType** del backend: `IMMEDIATE`, `SCHEDULED`), `recipientListIds`, `expiresAt`.

**Estados de promo (solo lectura en respuestas):** incluyen `DRAFT`, `SCHEDULED`, `SENDING`, `SENT`, `CANCELLED`, `FAILED`, `DELETED`, `EXPIRED` según entidad.

---

## 7. Recipient lists (`/recipient-lists`)

El **label** se infiere del JWT (`injectLabelIdFromAuthenticatedUser`); las rutas **no** llevan `:labelId` en el path.

| Método | Ruta | Cuerpo / query | Respuesta |
|--------|------|----------------|-----------|
| `GET` | `/recipient-lists/recipients` | — | Pool de contactos del label |
| `GET` | `/recipient-lists` | `?page`, `?limit`, `?search` | `{ "lists": [...], "total": number }` |
| `POST` | `/recipient-lists` | `{ "name": string }` | **201** lista |
| `GET` | `/recipient-lists/:listId` | — | Lista |
| `PUT` | `/recipient-lists/:listId` | **UpdateRecipientListDto** | Actualizada |
| `DELETE` | `/recipient-lists/:listId` | — | **204** (posible **409** si hay dependencias) |
| `GET` | `/recipient-lists/:listId/recipients` | — | Miembros |
| `POST` | `/recipient-lists/:listId/recipients` | **AddRecipientToListDto** | **200** vacío si OK |
| `DELETE` | `/recipient-lists/:listId/recipients/:recipientId` | — | **204** |
| `POST` | `/recipient-lists/:listId/recipients/bulk-upload` | **multipart** campo `file` (CSV/XLS/XLSX) | JSON con contadores (`added`, `updated`, `failed`, errores por fila según servicio) |

### AddRecipientToListDto

| Campo | Tipo | Notas |
|-------|------|--------|
| `email` | string | opcional; find-or-create |
| `recipientId` | string | opcional; ya en el pool |
| `display_name` | string | opcional; al agregar por email |

### UpdateRecipientListDto (`PUT`)

Opcionales: `name`, `recipientIds` (array de IDs).

---

## 8. Feedback

### 8.1 Ámbito label (`/feedback`) — sin `:labelId` en la URL

El middleware inyecta el label del usuario en la petición.

> **Cliente móvil:** al consumir `GET /feedback`, parsear **`feedback`** y **`total`**; no asumir que la API devuelve solo un array plano (r8-site normaliza `data.feedback` en código).

| Método | Ruta | Query | Respuesta |
|--------|------|--------|-----------|
| `GET` | `/feedback` | `releaseId`, `recipientId`, `rating`, `supported`, `status`, `priority`, `sentiment`, `category`, `search`, `limit`, `offset`, `sortBy`, `sortOrder` | **`{ "feedback": Feedback[], "total": number }`** |
| `GET` | `/feedback/pending-count` | — | `{ "count": number }` |
| `GET` | `/feedback/analytics` | **`dateFrom` y `dateTo` juntos** (mismo request) para definir rango; si faltan, el backend puede calcular sin rango acotado | Objeto **FeedbackAnalytics** (agregados) |
| `GET` | `/feedback/:feedbackId` | — | Un feedback |
| `GET` | `/feedback/liked-tracks` | — (Bearer o contexto destinatario) | Lista agrupada por release |

### 8.2 Por release (`/releases/:releaseId/feedback`)

Rutas montadas bajo releases; autenticación según rol (dueño del release vs destinatario con token).

| Método | Ruta | Cuerpo | Notas |
|--------|------|--------|--------|
| `GET` | `/releases/:releaseId/feedback` | Query: filtros similares (rating, supported, …) | `Feedback[]` |
| `POST` | `/releases/:releaseId/feedback` | **CreateFeedbackDto** (en la práctica el **ensure** envía al menos `userId` que coincide con el destinatario autenticado) | **200** si ya existía, **201** si se creó |
| `PATCH` | `/releases/:releaseId/feedback/:feedbackId` | **UpdateFeedbackDto** | Reglas de negocio: primer envío vs ediciones posteriores (el servidor puede limitar campos tras el primer submit) |
| `PATCH` | `/releases/:releaseId/feedback/:feedbackId/track-stats` | **TrackStatsDeltaItemDto[]** | Array de deltas |
| `PATCH` | `/releases/:releaseId/feedback/:feedbackId/track-stats/liked` | **SetTrackLikedDto** | Solo flag `liked` |
| `GET` | `/releases/:releaseId/feedback/:feedbackId` | — | Detalle |

### CreateFeedbackDto (`POST`)

| Campo | Tipo | Notas |
|-------|------|--------|
| `releaseId` | UUID | en ruta anidada suele omitirse en el cuerpo duplicado; el servidor fusiona |
| `userId` | UUID | usuario contacto promo (debe coincidir con quien crea) |
| `rating` | 1–5 | opcional |
| `comment` | string | opcional |
| `feedbackOptions` | string[] | opcional |
| `supported`, `willPlay` | boolean | opcional |
| `status` | `PENDING` \| `REVIEWED` \| `RESPONDED` \| `ARCHIVED` | uso según rol |
| `internalNotes`, `labelResponse` | string | gestión label |
| `sentiment` | `POSITIVE` \| `NEUTRAL` \| `NEGATIVE` | |
| `category` | string | |
| `priority` | `LOW` \| `MEDIUM` \| `HIGH` \| `URGENT` | |
| `favoriteTrackId` | UUID \| null | |
| `genre` | `TECHNO` \| `DEEP_HOUSE` \| `AMBIENT` | enum **FeedbackGenre** |

### UpdateFeedbackDto (`PATCH`)

Subconjunto opcional de campos del create orientado a actualización (rating, comment, willPlay, supported, status, notas internas, respuesta label, sentiment, category, priority, favoriteTrackId, genre — ver validadores).

### TrackStatsDeltaItemDto (cuerpo = **array**)

| Campo | Tipo |
|-------|------|
| `track_id` | UUID |
| `play_count` | entero ≥ 0 |
| `listening_time` | entero ≥ 0 (segundos promedio del batch) |

### SetTrackLikedDto

| Campo | Tipo |
|-------|------|
| `track_id` | UUID |
| `liked` | boolean |

---

## 9. Otros (solo si el curso los expone en stage)

- **Label features** (`/label-features`), **security tests** (`/security/tests/...`) y **admin** (`/admins`, `/features`, `/system-settings`) tienen DTOs propios; no forman parte del núcleo label/artista descrito en los equipos 1–5 salvo proyecto avanzado.

---

## 10. Referencias cruzadas

- Mapa de rutas y descripción funcional: [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md)
- Contrato detallado de módulos (para docentes o lectura opcional): repositorio **r8-api**, archivo `docs/MODULES.md` (los alumnos pueden no tener acceso).

---

*Documento creado en colaboración con Cursor.*

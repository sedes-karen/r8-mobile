# DTOs y cuerpos HTTP — API Stage (r8-api)

**Versión:** 2026-06-17  
**Audiencia:** alumnos **sin acceso al código** de r8-api; consumirán la API en **stage**.  
**URL base:** `https://api-stage.technopremieres.com`  
**Mapa de rutas y flujos:** [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md)

---

## Convenciones generales

| Tema | Regla |
|------|--------|
| **Base URL** | `https://api-stage.technopremieres.com` + ruta (ej. `/auth/login`) |
| **Content-Type** | `application/json` en requests con cuerpo (excepto `PUT` binario a URL firmada) |
| **Auth estándar** | `Authorization: Bearer <accessToken>` |
| **Auth destinatario promo** | Query `?token=<jwt_contacto>` (rol `guest`; puede combinarse con reglas por ruta) |
| **Refresh** | `POST /auth/refresh` con **cookie** httpOnly (`credentials` / equivalente en RN) |
| **IDs** | UUID en rutas y campos |
| **Fechas** | ISO 8601 en JSON; `releaseDate` en respuestas de release suele ser `YYYY-MM-DD` |
| **Errores** | `{ "message", "error" }` o array de validación; HTTP 400/401/403/404/409/410 |

> Si un campo no figura en el DTO de request, **no lo envíes** salvo verificación en stage. Los **enums** listados provienen del backend actual (`r8-api`).

---

## 1. Auth (`/auth`)

| Método | Ruta | Cuerpo (request) | Respuesta (resumen) |
|--------|------|------------------|---------------------|
| `POST` | `/auth/login` | `{ "email": string, "password": string }` | `{ "success": true, "user": <perfil>, "accessToken": string }` + cookie refresh |
| `POST` | `/auth/refresh` | (vacío; cookie refresh) | `{ "success": true, "accessToken": string }` |
| `POST` | `/auth/logout` | Opcional `{ "scope": "all" }` | `{ "success": true }` |
| `POST` | `/auth/validate` | — (Bearer) | Perfil / validación |
| `GET` | `/auth/me` | — (Bearer) | Igual que validate (usuario app, **no admin**) |

---

## 2. Usuarios (`/users`)

| Método | Ruta | Cuerpo (request) | Respuesta (resumen) |
|--------|------|------------------|---------------------|
| `POST` | `/users/register` | **RegisterBody** | **201** `{ "success": true, "user": <perfil>, "accessToken": string }` |
| `GET` | `/users/me` | — | Usuario enriquecido (`labels[]`, `artist`, URLs firmadas, `labelId` derivable) |
| `PUT` | `/users/me` | **UpdateUserDto** | Usuario actualizado |
| `POST` | `/users/me/change-password` | `{ "currentPassword": string, "newPassword": string }` | `{ "message": "Password changed successfully" }` |
| `GET` | `/users/me/recipient` | — | Vista recipient (email, displayName, flags) |
| `GET` | `/users/recipient-by-token?token=` | — | Contacto promo por token (sin Bearer) |
| `POST` | `/users/password/request-reset` | `{ "email": string }` | `{ "message": "If an account exists..." }` |
| `POST` | `/users/password/reset` | **ResetPasswordDto** | `{ "message": string, "accessToken": string }` |
| `POST` | `/users/unsubscribe` | — (Bearer: artist/label/guest) | **204** |
| `POST` | `/users/resubscribe` | — (Bearer: artist/label/guest) | **204** |

### RegisterBody (`POST /users/register`)

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|--------|
| `email` | string | sí | |
| `password` | string | sí | |
| `role` | `"label"` \| `"artist"` | sí | `"both"` → **400** |
| `labelName` | string | no | Si `role === "label"` (default generado) |
| `artistName`, `firstName`, `lastName` | string | no | Si `role === "artist"` |

> Tras registro **label**, el servidor crea label + stub de artista. Tras registro **artist**, crea artista + label vacío scaffold.

### UpdateUserDto (`PUT /users/me`)

Todos opcionales (al menos uno): `fullName`, `bandcampUrl`, `soundcloudUrl`, `instagramUrl`, `labelId`, `token_enabled`, `display_name`, `country`.

### ResetPasswordDto (`POST /users/password/reset`)

| Campo | Tipo | Notas |
|-------|------|--------|
| `email` | string | |
| `pin` | string | **4 caracteres** (PIN del email) |
| `newPassword` | string | mínimo **6** caracteres |
| `confirmPassword` | string | debe coincidir con `newPassword` |

---

## 3. Labels (`/labels`)

| Método | Ruta | Cuerpo | Respuesta |
|--------|------|--------|-----------|
| `POST` | `/labels` | `{ "name": string }` | Label **201** |
| `GET` | `/labels` | — | Array de labels del usuario |
| `GET` | `/labels/me` | — | Label primario |
| `PUT` | `/labels/me` | **UpdateLabelDto** | Label actualizado |
| `GET` | `/labels/me/profile-image` | — | `{ "url": string \| null, "expiresAt"?: string }` |
| `POST` | `/labels/me/profile-image` | `{ "contentType": string }` | **201** `{ "uploadUrl", "expiresIn", "path" }` |
| `POST` | `/labels/me/profile-image/confirm` | `{ "path": string }` | **201** |
| `GET/PUT/DELETE` | `/labels/:id` | **UpdateLabelDto** en PUT | CRUD por id |
| `POST/GET/POST .../confirm` | `/labels/:id/profile-image` | Igual patrón que `/me` | Admin u operación autorizada |

### UpdateLabelDto

Opcionales: `name`, `description`, `bandcampUrl`, `soundcloudUrl`, `instagramUrl`, `twitterUrl`, `profileImagePath` (en flujo normal la imagen se confirma vía presign, no manual).

---

## 4. Artistas (`/artists`)

| Método | Ruta | Cuerpo | Respuesta |
|--------|------|--------|-----------|
| `POST` | `/artists` | **CreateArtistDto** | **201** |
| `GET` | `/artists/me` | — | Entidad artista |
| `PUT` | `/artists/me` | **UpdateArtistDto** | Actualizado |
| `DELETE` | `/artists/me` | — | **204** |
| `POST` | `/artists/me/profile-image` | `{ "contentType": string }` | **201** presign |
| `POST` | `/artists/me/profile-image/confirm` | `{ "path": string }` | **201** |
| `GET` | `/artists/me/profile-image` | — | `{ "url": string \| null }` |
| `GET` | `/artists/me/label-unsubscriptions` | — | `[{ labelId, labelName, unsubscribedAt }]` |
| `POST` | `/artists/me/label-unsubscriptions/:labelId` | — | **204** |
| `DELETE` | `/artists/me/label-unsubscriptions/:labelId` | — | **204** |

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
| `GET` | `/releases/all` | — | Array público (`status = CREATED`) |
| `GET` | `/releases` | — | Ver **ReleasesListResponse** |
| `POST` | `/releases` | **CreateReleaseUnderLabelDto** | **201** release |
| `GET` | `/releases/:releaseId` | `?token=` opcional | Release + `coverUrl`, `tracks[].audioUrl`, `releaseAudioQuota` |
| `PATCH` | `/releases/:releaseId` | **UpdateReleaseDto** | Release actualizado |
| `DELETE` | `/releases/:releaseId` | — | **204** o **409** `DELETE_DEPENDENCY_ERROR` |
| `GET` | `/releases/:releaseId/files` | — | Lista de descriptores |
| `GET/DELETE` | `/releases/:releaseId/files/:fileId` | — | `fileId` = `artwork` o UUID de track |

### ReleasesListResponse (`GET /releases`)

```json
{
  "releases": [ /* Release[] */ ],
  "hostingQuota": { "usedBytes": number, "maxBytes"?: number },
  "releaseAudioQuota": { "maxBytes": number }
}
```

Si el usuario no tiene label, la API puede responder `[]` (array vacío) en lugar del objeto envuelto.

### CreateReleaseUnderLabelDto (`POST /releases`)

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|--------|
| `title` | string | no* | *Validaciones al publicar |
| `artist` | string | no* | |
| `releaseDate` | string | no* | Validada en servidor |
| `type` | enum | no | **`EP`** \| **`VA`** \| **`ALBUM`** (default `EP`) |
| `formats` | enum[] | no | **`DIGITAL`** \| **`VINYL`** |
| `catalogNumber` | string | no | máx. 10 caracteres |
| `notes` | string | no | |
| `soundcloudUrl`, `bandcampUrl` | string | no | máx. 500 chars |
| `tracks` | **CreateTrackDto[]** | no | |

### CreateTrackDto

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| `title` | string | sí |
| `trackNumber` | number (≥ 1) | sí |
| `duration` | number (≥ 1) | no | segundos |

### UpdateReleaseDto (`PATCH /releases/:releaseId`)

Opcionales: `title`, `artist`, `artistId`, `artistEmail`, `releaseDate`, `type` (**`EP` \| `VA` \| `ALBUM`**), `formats`, `catalogNumber` (string \| null), `status` (**`DRAFT` \| `CREATED`**), `notes`, `soundcloudUrl`, `bandcampUrl`, `tracks[]` (`id`, `title`, `artist`, `trackNumber`).

### 5.2 Artwork y audio (presign + confirm)

**Artwork**

| Paso | Método | Ruta | Cuerpo |
|------|--------|------|--------|
| 1 | `PUT` | `/releases/:releaseId/artwork` | `{ "filename": string, "mimetype"?: string }` |
| 2 | `PUT` | `<uploadUrl>` | binario |
| 3 | `POST` | `/releases/:releaseId/artwork/confirm` | `{ "path": string }` |

**Audio de track**

| Paso | Método | Ruta | Cuerpo |
|------|--------|------|--------|
| 1 | `PUT` | `/releases/:releaseId/tracks/:trackId` | `{ "filename": string, "mimetype"?: string, "expectedSize"?: number }` |
| 2 | `PUT` | `<uploadUrl>` | binario |
| 3 | `POST` | `/releases/:releaseId/tracks/:trackId/confirm` | `{ "path": string }` |

- **`expectedSize`:** bytes del archivo; si supera cuota → **409** `RELEASE_AUDIO_QUOTA_EXCEEDED` con `{ code, used, max }`.
- Lectura: `coverUrl` y `tracks[].audioUrl` en **`GET /releases/:releaseId`**.

---

## 6. Promos (`/promos`)

| Método | Ruta | Query / cuerpo | Respuesta |
|--------|------|----------------|-----------|
| `GET` | `/promos/for-label` | `?labelId=<uuid>` si el usuario tiene varios labels | Array de promos listado |
| `GET` | `/promos/dashboard/:labelId` | — | Dashboard (label o artist según rol) |
| `GET` | `/promos/inbox` | `?token=`, `?no-feedback-only=true` | **PromoInboxItemDto[]** |
| `GET` | `/promos/inbox/pending-count` | `?token=` | `{ "count": number }` |
| `GET` | `/promos/:id` | `?token=` | **PromoDetailDto** (slim) |
| `POST` | `/promos` | **CreatePromoDto** | **201** |
| `PATCH` | `/promos/:id` | **UpdatePromoDto** | Actualizado |
| `DELETE` | `/promos/:id` | — | **204** o **409** |
| `POST` | `/promos/:id/send` | — | Envío manual |
| `POST` | `/promos/:id/cancel` | — | Cancelación |
| `POST` | `/promos/:id/dismiss` | `?token=` | **204** |
| `GET` | `/promos` | — | **Solo admin** |

### CreatePromoDto (`POST /promos`)

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|--------|
| `releaseId` | UUID | sí | |
| `sendType` | **`IMMEDIATE`** \| **`SCHEDULED`** | sí | |
| `scheduledAt` | string ISO | condicional | Obligatorio si `SCHEDULED` |
| `recipientListIds` | UUID[] | no | |
| `useCuratedDb` | boolean | no | default `false` |
| `expiresAt` | string ISO | no | |

### UpdatePromoDto (`PATCH /promos/:id`)

Opcionales: `scheduledAt`, `useCuratedDb`, `sendType`, `recipientListIds`, `expiresAt`.

### Estados de promo (solo lectura)

`DRAFT`, `SCHEDULED`, `SENDING`, `SENT`, `CANCELLED`, `FAILED`, `EXPIRED` — **no** existe `DELETED` (delete físico).

### PromoInboxItemDto (resumen `GET /promos/inbox`)

Campos habituales: `id`, `labelId`, `labelName`, `release` (con `tracks[].src` para audio), `feedback?`, `status`, `isActive`, `sentAt?`, `expiresAt?`.

### PromoDetailDto (resumen `GET /promos/:id`)

Incluye: `id`, `release` (slim: `id`, `title`, `artistName`, `labelName`, `catalogNumber`, `artwork`, `releaseDate`, `type`, `notes`), `scheduledAt`, `status`, `isActive`, `useCuratedDb`, `recipientLists`, `createdAt`, `updatedAt`, `errorMessage?`.  
**No** incluye: `labelId`, `releaseId`, `recipientListIds`, `release.tracks` (para audio usar `GET /releases/:releaseId`).

---

## 7. Recipient lists (`/recipient-lists`)

Sin `:labelId` en la URL; el tenant lo resuelve el JWT.

| Método | Ruta | Cuerpo / query | Respuesta |
|--------|------|----------------|-----------|
| `GET` | `/recipient-lists/recipients` | — | Pool `Recipient[]` |
| `GET` | `/recipient-lists` | `?page`, `?limit`, `?search` | **RecipientListsIndexResponse** |
| `POST` | `/recipient-lists` | `{ "name": string, "recipientIds"?: string[] }` | **201** lista |
| `GET` | `/recipient-lists/:listId` | — | Lista |
| `PUT` | `/recipient-lists/:listId` | **UpdateRecipientListDto** | Actualizada |
| `DELETE` | `/recipient-lists/:listId` | — | **204** o **409** |
| `GET` | `/recipient-lists/:listId/recipients` | — | Miembros |
| `POST` | `/recipient-lists/:listId/recipients` | **AddRecipientToListDto** | **200** `{ "recipientId": string }` |
| `DELETE` | `/recipient-lists/:listId/recipients/:recipientId` | — | **204** |
| `POST` | `/recipient-lists/:listId/recipients/batch` | **BatchAddRecipientsDto** | **200** **BatchAddRecipientsResponse** |

### RecipientListsIndexResponse (`GET /recipient-lists`)

```json
{
  "lists": [
    {
      "id": "uuid",
      "name": "string",
      "hasNonValidMailRecipients": false
    }
  ],
  "total": 0,
  "deliverySummary": {
    "totalUniqueEmails": 0,
    "deliveredUniqueEmails": 0
  }
}
```

### AddRecipientToListDto

| Campo | Tipo | Notas |
|-------|------|--------|
| `email` | string | opcional; find-or-create |
| `recipientId` | string | opcional; ya en el pool |
| `display_name` | string | opcional; al agregar por email |

### BatchAddRecipientsDto (`POST .../batch`)

Enviar **exactamente uno** de:

| Variante | Cuerpo |
|----------|--------|
| Por IDs | `{ "recipientIds": ["uuid", ...] }` |
| Por emails | `{ "recipients": [{ "email": string, "display_name"?: string }] }` |

> **Carga masiva CSV/XLS:** parsear en el **cliente mobile** y enviar el JSON `recipients`. **No** existe `bulk-upload` multipart en la API actual.

### BatchAddRecipientsResponse

```json
{
  "added": [{ "recipientId": "uuid", "email": "a@b.com" }],
  "skipped": 0
}
```

### UpdateRecipientListDto (`PUT`)

Opcionales: `name`, `recipientIds` (array único de IDs).

---

## 8. Feedback

### 8.1 Ámbito label (`/feedback`)

| Método | Ruta | Query | Respuesta |
|--------|------|--------|-----------|
| `GET` | `/feedback` | `releaseId`, `recipientId`, `rating`, `supported`, `status`, `priority`, `sentiment`, `category`, `search`, `limit`, `offset`, `sortBy`, `sortOrder`, `dateFrom`, `dateTo` | **`{ "feedback": Feedback[], "total": number }`** |
| `GET` | `/feedback/pending-count` | — | `{ "count": number }` |
| `GET` | `/feedback/analytics` | **`dateFrom` y `dateTo` juntos** para rango | Objeto analytics |
| `GET` | `/feedback/:feedbackId` | — | `Feedback` |
| `GET` | `/feedback/liked-tracks` | `?token=` | **LikedTracksReleaseItemDto[]** |
| `PATCH` | `/feedback/track-stats/downloaded` | `?token=` | **Feedback[]** |

### LikedTracksReleaseItemDto (resumen)

`feedbackId`, `releaseId`, `labelId`, `labelName`, `title`, `artistName`, `artwork`, `downloadsEnabled`, `promoExpired`, `tracks[]` con `trackId`, `title`, `duration`, `url`, `downloaded`, `audioSize`.

### 8.2 Por release (`/releases/:releaseId/feedback`)

| Método | Ruta | Cuerpo | Respuesta |
|--------|------|--------|-----------|
| `GET` | `/releases/:releaseId/feedback` | query filtros | **`{ summary, total, items }`** |
| `POST` | `/releases/:releaseId/feedback` | **CreateFeedbackDto** | **200** existente / **201** creado |
| `GET` | `/releases/:releaseId/feedback/:feedbackId` | — | `Feedback` |
| `PATCH` | `/releases/:releaseId/feedback/:feedbackId` | **UpdateFeedbackDto** | Actualizado |
| `PATCH` | `.../track-stats` | **TrackStatsDeltaItemDto[]** | `Feedback` |
| `PATCH` | `.../track-stats/liked` | **SetTrackLikedDto** | `Feedback` |
| `PATCH` | `.../track-stats/downloaded` | `{ "track_id": uuid }` | `Feedback` |

### ReleaseFeedbackListResponse (`GET .../feedback`)

```json
{
  "summary": { "feedbackCount": 0, "averageRating": null },
  "total": 0,
  "items": [
    {
      "id": "uuid",
      "rating": null,
      "comment": null,
      "willPlay": null,
      "supported": false,
      "createdAt": "ISO",
      "updatedAt": "ISO",
      "trackStats": [],
      "recipient": { "email": "", "displayName": null, "profileImageUrl": null }
    }
  ]
}
```

### CreateFeedbackDto (`POST`)

| Campo | Tipo | Notas |
|-------|------|--------|
| `userId` | UUID | **Obligatorio** — `users.id` del contacto promo |
| `rating` | 1–5 | opcional |
| `comment` | string | opcional |
| `feedbackOptions` | string[] | opcional |
| `supported`, `willPlay` | boolean | opcional |
| `status` | `PENDING` \| `REVIEWED` \| `RESPONDED` \| `ARCHIVED` | gestión label |
| `internalNotes`, `labelResponse` | string | label |
| `sentiment` | `POSITIVE` \| `NEUTRAL` \| `NEGATIVE` | |
| `category` | string | |
| `priority` | `LOW` \| `MEDIUM` \| `HIGH` \| `URGENT` | |

> En ensure (abrir formulario), enviar solo `{ "userId": "<uuid>" }`.

### UpdateFeedbackDto (`PATCH`)

Opcionales: `rating`, `comment`, `willPlay`, `supported`, `status`, `internalNotes`, `labelResponse`, `sentiment`, `category`, `priority`.

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

### SetTracksDownloadedBatchItemDto (`PATCH /feedback/track-stats/downloaded`)

Cuerpo = **array**:

| Campo | Tipo |
|-------|------|
| `user_id` | UUID contacto promo |
| `release_id` | UUID release |
| `tracks` | UUID[] (track ids a marcar descargados; idempotente) |

---

## 9. Utilidades y diagnóstico

| Método | Ruta | Auth | Respuesta |
|--------|------|------|-----------|
| `GET` | `/health` | — | **200** si API viva |
| `GET` | `/` | — | Info de aplicación |

---

## 10. Fuera de alcance del curso (referencia breve)

No forman parte del núcleo equipos 1–5; existen en stage pero no se documentan DTOs aquí:

- **Admin:** `/admins`, `GET /promos`, `/features`, `/system-settings`
- **Promo codes Bandcamp:** `/promo-codes/...`
- **Label features:** `/label-features/...`
- **Security tests:** `/security/tests/...`

Contrato completo: **r8-api** `docs/MODULES.md` (lectura opcional docentes).

---

## 11. Referencias cruzadas

- Rutas, roles y flujos: [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md)
- Cliente web de referencia: **r8-site** `src/api/`
- Variable Expo sugerida: `EXPO_PUBLIC_API_URL=https://api-stage.technopremieres.com`

---

*Documento sincronizado con r8-api y r8-site — 2026-06-17.*

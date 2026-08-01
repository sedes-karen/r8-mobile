# Pantallas — Desglose por pantalla

Para cada pantalla se indica su **ruta en el árbol de navegación** y la lista de características funcionales que debe implementar. La mayoría son aún **placeholders** (el código de `src/screens/` renderiza un texto de "editar pantalla"); la navegación ya funciona.

---

## Auth

### `src/screens/Auth/Login.tsx` — `Auth/Login`

- Inicio de sesión con **email** y **contraseña**.
- Orquesta `POST /auth/login` → `GET /users/me` → `applySession` (via `useLogin`).
- Resuelve el rol automáticamente y navega al stack Artist o Label.
- Maneja estados de **carga**, **error** (credenciales inválidas) y **éxito**.
- **Pendiente:** cablear el formulario (`useLogin` ya existe en `features/auth/useLogin`).

### `src/screens/Auth/SignUp.tsx` — `Auth/SignUp`

- Registro de nuevo usuario con rol **label** o **artist** (`POST /users/register`).
- Campos según rol: `labelName` para label; `artistName`, `firstName`, `lastName` para artist.
- Flujo alternativo de completar cuenta de contacto promo (`POST /users/register?token=`).
- Navegación posterior al stack del rol creado.

### `src/screens/Auth/PasswordReset.tsx` — `Auth/PasswordReset`

- Recuperación de contraseña en dos pasos.
- Paso 1: `POST /users/password/request-reset` (envía PIN por email).
- Paso 2: `POST /users/password/reset` (PIN + nueva contraseña + confirmación).
- Validaciones de los campos del formulario.

---

## Artist

### `src/screens/Artist/Promos/Player.tsx` — `Artist/Promos/Player`

- Lista las promos recibidas (**inbox**).
- Consulta `GET /promos/inbox` (con `?token=` si es guest) y `GET /promos/inbox/pending-count` para el contador de pendientes.
- Navegación al detalle de cada promo y a la lista de favoritos (LikedTracks).
- Estados de carga / vacío / error.

### `src/screens/Artist/Promos/Details.tsx` — `Artist/Promos/Details`

- Detalle de una promo (`GET /promos/:id`).
- **Reproductor de audio**: resuelve `release.id` y llama `GET /releases/:releaseId` para `tracks[].audioUrl` y `coverUrl`.
- Botones de **feedback** (navega al formulario) y **dismiss** (`POST /promos/:id/dismiss`).
- Permite marcar tracks como **descargados** y **favoritos**.

### `src/screens/Artist/Promos/Feedback.tsx` — `Artist/Promos/Feedback`

- Formulario de retroalimentación sobre una promo.
- Asegura el feedback: `POST /releases/:releaseId/feedback` con `{ userId }`.
- Envía el formulario: `PATCH /releases/:releaseId/feedback/:feedbackId` con `rating`, `comment`, `willPlay`, `supported` (solo primer envío).
- Registra estadísticas de reproducción (`track-stats`), likes y descargas.
- Confirmación visual del envío.

### `src/screens/Artist/Promos/LikedTracks.tsx` — `Artist/Promos/LikedTracks`

- Lista las canciones marcadas como favoritas.
- Consulta `GET /feedback/liked-tracks` (con `?token=` si aplica).
- Muestra información agrupada por release y permite reproducir/descargar.

### `src/screens/Artist/Profile/View.tsx` — `Artist/Profile/View`

- Visualización del perfil del artista.
- Consulta `GET /users/me`, `GET /artists/me` y avatar (`GET /artists/me/profile-image`).
- Muestra nombre, bio, redes y avatar.
- Navegación a edición.

### `src/screens/Artist/Profile/Edit.tsx` — `Artist/Profile/Edit`

- Edición de datos del perfil (`PUT /artists/me`).
- **Subida de imagen** de perfil (presign → PUT binario → confirm).
- Validación de campos y feedback de éxito/error.

---

## Label

### `src/screens/Label/Dashboard.tsx` — `Label/Dashboard`

- Dashboard del label.
- Consulta `GET /users/me` (contexto/`labelId`) y `GET /promos/for-label?labelId=` (promos recientes).
- Muestra datos de bienvenida y resumen de actividad.

### `src/screens/Label/Analytics.tsx` — `Label/Analytics`

- Métricas agregadas por release y por rango de fechas.
- Consulta `GET /users/me`, `GET /releases` (catálogo del tenant) y `GET /feedback` (`{ feedback, total }`).
- Rango de fechas opcional con `GET /feedback/analytics?dateFrom=&dateTo=` (ambos parámetros).
- Selector de release + métricas base.

### `src/screens/Label/Profile/View.tsx` — `Label/Profile/View`

- Visualización del perfil del label.
- Consulta `GET /users/me`, `GET /labels/me` y avatar (`GET /labels/me/profile-image`).
- Muestra datos del sello y redes sociales.

### `src/screens/Label/Profile/Edit.tsx` — `Label/Profile/Edit`

- Edición del perfil (`PUT /labels/me`): nombre, descripción, URLs sociales.
- **Subida de imagen** de avatar (presign → PUT → confirm).
- **Cambio de contraseña** (`POST /users/me/change-password`) — revoca cookies de refresh.

### `src/screens/Label/Releases/List.tsx` — `Label/Releases/List`

- Lista de releases del label.
- Consulta `GET /releases` (respuesta `{ releases, hostingQuota, releaseAudioQuota }`).
- Navegación al detalle (`releaseId`).
- Estados de carga / vacío / error.

### `src/screens/Label/Releases/New.tsx` — `Label/Releases/New`

- Creación de un release (`POST /releases`).
- Campos: `title`, `artist`, `releaseDate`, `type` (`EP`/`VA`/`ALBUM`), `formats` (`DIGITAL`/`VINYL`), `catalogNumber`, `notes`, URLs, `tracks`.
- Validaciones y estados de mutación.

### `src/screens/Label/Releases/Details.tsx` — `Label/Releases/Details`

- Detalle de un release (`GET /releases/:releaseId`).
- Muestra metadata, artwork (`coverUrl`), tracks (con `audioUrl`) y cuotas.
- Acceso a la gestión de promos de ese release.

### `src/screens/Label/Releases/Edit.tsx` — `Label/Releases/Edit`

- Edición de un release (`PATCH /releases/:releaseId`).
- **Artwork** (presign → PUT → confirm) y **audio** por track (`/releases/:releaseId/tracks/:trackId`).
- Actualización de tracks, tipo y estado (`DRAFT`/`CREATED`).

### `src/screens/Label/Releases/Promos/List.tsx` — `Label/Releases/Promos/List`

- Lista de promos atadas a un release particular.
- Consulta `GET /promos/for-label?labelId=` y filtra por release.
- Navegación al detalle y creación de nuevas promos.

### `src/screens/Label/Releases/Promos/New.tsx` — `Label/Releases/Promos/New`

- Creación de una promo para una release específica (`POST /promos`).
- Campos: `releaseId`, `sendType` (`IMMEDIATE`/`SCHEDULED`), `scheduledAt`, `recipientListIds`, `useCuratedDb`, `expiresAt`.

### `src/screens/Label/Releases/Promos/Details.tsx` — `Label/Releases/Promos/Details`

- Detalle de una promo (`GET /promos/:id`).
- Muestra resumen, estado (`DRAFT`/`SCHEDULED`/`SENDING`/`SENT`/`CANCELLED`/`FAILED`/`EXPIRED`), listas y fechas.
- Acciones de **enviar** (`POST .../send`) y **cancelar** (`POST .../cancel`).

### `src/screens/Label/Releases/Promos/Edit.tsx` — `Label/Releases/Promos/Edit`

- Edición de una promo (`PATCH /promos/:id`).
- Ajuste de `scheduledAt`, `sendType`, `recipientListIds`, `useCuratedDb`, `expiresAt`.
- **Eliminación** (`DELETE /promos/:id`) en estados permitidos.

### `src/screens/Label/RecipientLists/List.tsx` — `Label/RecipientLists/List`

- Índice de listas de destinatarios.
- Consulta `GET /recipient-lists` (`page`, `limit`, `search`), con `deliverySummary` y `hasNonValidMailRecipients` por lista.
- Navegación a detalle, edición, feedback y alta.

### `src/screens/Label/RecipientLists/New.tsx` — `Label/RecipientLists/New`

- Creación de una nueva lista (`POST /recipient-lists` con `{ name }`).

### `src/screens/Label/RecipientLists/Details.tsx` — `Label/RecipientLists/Details`

- Detalle de una lista (`GET /recipient-lists/:listId`).
- Miembros (`GET /recipient-lists/:listId/recipients`).
- Alta de destinatario por email/ID (`POST .../recipients`).

### `src/screens/Label/RecipientLists/Edit.tsx` — `Label/RecipientLists/Edit`

- Edición de una lista (`PUT /recipient-lists/:listId`): nombre y `recipientIds`.
- **Eliminación** (`DELETE /recipient-lists/:listId`) manejando `409` por dependencias.
- Quitar miembros (`DELETE .../recipients/:recipientId`).

### `src/screens/Label/RecipientLists/Feedback.tsx` — `Label/RecipientLists/Feedback`

- Listado y métricas de feedback del label.
- Consulta `GET /feedback` (`{ feedback, total }`), `GET /feedback/pending-count` y opcionalmente `GET /feedback/analytics`.
- Filtros y navegación al detalle de cada feedback.

### `src/screens/Label/RecipientLists/BulkUpload.tsx` — `Label/RecipientLists/BulkUpload`

- **Carga masiva** de destinatarios desde CSV/Excel **parseado en el dispositivo**.
- Envía JSON a `POST /recipient-lists/:listId/recipients/batch` con `recipientIds[]` o `recipients[]` (exactamente uno).
- Muestra el resultado `{ added, skipped }`.

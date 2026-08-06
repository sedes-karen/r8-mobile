# Equipo 3 — Especificación funcional técnica

## Integrantes

| Rol | Nombre |
|-----|--------|
| **Team Lead (TL)** | Crimella, Mateo Nahuel |
| Integrante | Bianchi, Germán |
| Integrante | Gutiérrez, Magalí |
| Integrante | Mai, Jeremías |
| Integrante | Peverelli, Enzo |
| Integrante | Rivero, Lautaro |
| Integrante | Romero, Giuliana |

---

Foco de equipo: Promos Player, Liked Tracks y feedback de receptor/artista.

Objetivo: consolidar experiencia core del usuario receptor/artista.

**Contrato HTTP actual:** ver [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md). El feedback de release vive bajo **`/releases/:releaseId/feedback`**, no bajo `/labels/...`. **DTOs:** [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Promos Player (inbox + detalle reproducción) — lectura
2. Liked Tracks (favoritos del player) — lectura
3. Formulario de feedback del destinatario (ruta web `/promo/:id/feedback`) — lectura/carga
4. Promos Player — acciones de feedback/dismiss
5. Formulario de feedback del destinatario — envío

---

## 2. Detalle técnico por pantalla

### 2.1 Promos Player (lectura)

- Ruta web origen: `/promos-player`
- Requests:
  - `GET /promos/inbox` (query `token=` si el usuario entra sin sesión Bearer)
  - `GET /promos/inbox/pending-count`
  - `GET /promos/:id` — detalle con release embebido (puede venir **slim**, sin URLs de audio)
  - **Reproductor:** tomar `release.id` del detalle de promo y llamar **`GET /releases/:releaseId?token=`** para `tracks[].audioUrl` y `coverUrl` (no asumir que un solo GET de promo alcanza)
- Criterio:
  - lista inbox, detalle promo y reproducción básica funcionando.

### 2.2 Liked Tracks

- Ruta web origen: funcionalidad dentro de player
- Requests:
  - `GET /feedback/liked-tracks` (con `?token=` si aplica)
- Criterio:
  - listado de favoritos visible y navegable.

### 2.3 Formulario de feedback del destinatario (lectura)

- Ruta web origen: `/promo/:id/feedback`
- Requests:
  - `GET /promos/:id` (carga promo y contexto)
- Criterio:
  - pantalla carga promo y formulario.

### 2.4 Promos Player (feedback/dismiss)

- Requests:
  - Asegurar feedback: `POST /releases/:releaseId/feedback` — body `{ userId }` donde `userId` es el contacto **autenticado** (Bearer o `?token=`); **200** si ya existía, **201** si se creó
  - Formulario: `PATCH /releases/:releaseId/feedback/:feedbackId` — **solo aplica en primer envío** (cuando `rating` era `null`)
  - Stats de escucha: `PATCH /releases/:releaseId/feedback/:feedbackId/track-stats`
  - Like de track: `PATCH /releases/:releaseId/feedback/:feedbackId/track-stats/liked`
  - Descartar del inbox: `POST /promos/:id/dismiss` — con `?token=` o Bearer con rol **`guest`** (no basta cualquier sesión `artist` sin ese rol)
  - Descargas en lote: `PATCH /feedback/track-stats/downloaded` con array `[{ user_id, release_id, tracks: [uuid...] }]` (patrón `r8-site/src/api/feedback.ts`)
- Criterio:
  - feedback incremental y dismiss estables.

### 2.5 Formulario de feedback del destinatario (envío)

- Requests:
  - Mismas rutas bajo `/releases/:releaseId/feedback` que en la sección 2.4 de este documento (create/ensure + PATCH formulario).
- Criterio:
  - submit funcional con confirmación al usuario.

---

## 3. Dependencias y acuerdos

- Requiere autenticación/token de Equipo 1.
- Debe coordinar modelo `Feedback` con equipos 2 y 4.

---

## 4. Entregables

- Flujo de reproducción + favoritos operativo.
- Captura de feedback sin regresiones.
- Casos de prueba de token y sin token.

---

*Documento creado en colaboración con Cursor.*

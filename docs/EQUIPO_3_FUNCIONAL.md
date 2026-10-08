# Equipo 3 — Especificación funcional técnica

## Integrantes

| Rol | Nombre | Usuario GitHub |
|-----|--------|----------------|
| **Team Lead (TL)** | Crimella, Mateo Nahuel | Bowuigi |
| Integrante | Bianchi, Germán | G3rm41n |
| Integrante | Gutiérrez, Magalí | Magali0404 |
| Integrante | Mai, Jeremías | Maisena1 |
| Integrante | Peverelli, Enzo | EnzoPeverelli |
| Integrante | Rivero, Lautaro | PulS3G |
| Integrante | Romero, Giuliana | giulianaromero22 |

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
  - Enlace público (sin JWT de contacto): `GET /promos/:id/public` y, con sesión artist/label/guest, `POST /promos/:id/public-access` → `{ ok: true }`
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

## 5. Evaluación de código (borrador)

Corte: **16 sep 2026**. Fuente: PRs y commits en `sedes-karen/r8-mobile` (no es participación ni asistencia). Criterio de tercer año: evidencia de aprendizaje, no listón de Jr.

Niveles: **Sin evidencia** · **En camino** · **Cumple** · **Destaca**.  
Sin rastro en GitHub, el resto de ejes queda en — (no se evalúa lo que no está).  
**Rastro:** aparecen PRs o commits tuyos en este repo.  
**Intención:** se entiende qué quisiste hacer (título, descripción o el propio diff).  
**DoD (definición de listo):** el recorte cumple lo pedido en este documento (se ve, hay datos o mock, no rompe el flujo).  
**Claridad:** un tema por PR, se puede revisar, sin ruido (lockfile, archivos de otro recorte).

| Integrante | PRs / commits | Rastro | Intención | DoD | Claridad |
|------------|---------------|--------|-----------|-----|----------|
| Crimella, Mateo Nahuel | 5 merge | Destaca | Destaca | Cumple | Destaca |
| Bianchi, Germán | 0 | Sin evidencia | — | — | — |
| Gutiérrez, Magalí | 1 abierto · 1 cerrado (draft) | En camino | En camino | En camino | En camino |
| Mai, Jeremías | 2 merge | Destaca | Cumple | Cumple | Cumple |
| Peverelli, Enzo | 1 abierto · 1 cerrado | Cumple | Cumple | Cumple | En camino |
| Rivero, Lautaro | 1 abierto | Cumple | Destaca | Cumple | Destaca |
| Romero, Giuliana | 0 | Sin evidencia | — | — | — |

### Notas y recomendaciones

**Crimella, Mateo Nahuel** (`Bowuigi`) — La navegación y la estructura del repo (#2, #1) son el piso de todos los equipos. Seguí empujando el dominio del Equipo 3 (player/feedback) para que el DoD no quede solo en infra.

**Bianchi, Germán** (`G3rm41n`) — Sin PRs ni commits. Un primer PR (Liked Tracks lectura o un estado vacío del inbox) para aparecer en el rastro; lo vemos en clase.

**Gutiérrez, Magalí** (`Magali0404`) — El draft #6 fue un cambio trivial en `App.tsx`. El #51 (tests del Player) va para el lado correcto: mantenelo verde y alineado a la pantalla actual, no a un mock viejo.

**Mai, Jeremías** (`Maisena1`) — Player mergeado (#21 y #30) con tipos y `promos` API: es el recorte del equipo. El siguiente salto del DoD es loading/error/vacío e inbox real, no otra pantalla nueva.

**Peverelli, Enzo** (`EnzoPeverelli`) — Detalle de promo (#40) es el recorte justo. El #39 parece el mismo trabajo cerrado: dejá uno solo. Aparecés también en el #45 del Equipo 5: si fue colaboración, mencionálo en el PR; si fue un commit cruzado, separemos repos mentales por equipo.

**Rivero, Lautaro** (`PulS3G`) — El #43 (hook `useArtistPromos` + tests) es el tipo de PR que queremos: un tema, explicación y prueba. Mergealo cuando Player establezca la base, para no pelear diffs.

**Romero, Giuliana** (`giulianaromero22`) — Sin PRs ni commits. Recorte posible: formulario de feedback (lectura o el PATCH) en un PR chico.

---

*Documento creado en colaboración con Cursor.*

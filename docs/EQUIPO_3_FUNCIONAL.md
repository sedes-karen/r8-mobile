# Equipo 3 — Especificación funcional técnica

Foco de equipo: Promos Player, Liked Tracks y feedback de receptor/artista.

Objetivo: consolidar experiencia core del usuario receptor/artista.

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Promos Player (inbox + detalle reproducción) — lectura
2. Liked Tracks (favoritos del player) — lectura
3. Feedback simple legacy — lectura/carga
4. Promos Player — acciones de feedback/dismiss
5. Feedback simple legacy — envío

---

## 2. Detalle técnico por pantalla

## 2.1 Promos Player (lectura)

- Ruta web origen: `/promos-player`
- Requests:
  - `GET /promos/inbox`
  - `GET /promos/inbox/pending-count`
  - `GET /promos/:id`
  - `GET /labels/:labelId/releases/:releaseId`
- Criterio:
  - lista inbox, detalle promo y reproducción básica funcionando.

## 2.2 Liked Tracks

- Ruta web origen: funcionalidad dentro de player
- Requests:
  - `GET /feedback/liked-tracks`
- Criterio:
  - listado de favoritos visible y navegable.

## 2.3 Feedback simple legacy (lectura)

- Ruta web origen: `/promo/:id/feedback`
- Requests:
  - `GET /promos/:id`
- Criterio:
  - pantalla carga promo y formulario.

## 2.4 Promos Player (feedback/dismiss)

- Requests:
  - `POST /labels/:labelId/releases/:releaseId/feedback`
  - `PATCH /labels/.../feedback/:feedbackId`
  - `PATCH /labels/.../feedback/:feedbackId/track-stats`
  - `PATCH /labels/.../feedback/:feedbackId/track-stats/liked`
  - `POST /promos/:id/dismiss`
- Criterio:
  - feedback incremental y dismiss estables.

## 2.5 Feedback simple legacy (envío)

- Requests:
  - `POST /labels/:labelId/releases/:releaseId/feedback`
- Criterio:
  - submit funcional con confirmación al usuario.

---

## 3. Dependencias y acuerdos

- Requiere autenticación/token de Equipo 1.
- Debe coordinar modelo `Feedback` con equipos 2 y 4.

---

## 4. Entregables

- Flujo de reproducción + favoritos operativo.
- Captura de feedback sin regressions.
- Casos de prueba de token y sin token.

<!-- Documento creado en colaboración con Cursor -->

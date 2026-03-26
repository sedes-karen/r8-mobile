# Equipo 5 — Especificación funcional técnica

Foco de equipo: Recipients, Audience Lists y Feedback (label).

Objetivo: cubrir gestión de destinatarios/listas y explotación de feedback para label.

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Destinatarios (Recipients) — lectura
2. Listas de audiencia (índice) — lectura
3. Detalle lista de audiencia — lectura
4. Feedback (label) — lectura y métricas
5. Destinatarios (Recipients) — creación/edición/toggles
6. Editar lista de audiencia — edición/borrado
7. Detalle lista de audiencia — bulk upload

---

## 2. Detalle técnico por pantalla

## 2.1 Destinatarios (lectura)

- Ruta web origen: `/recipients`
- Requests:
  - `GET /recipients`
  - `GET /recipients/:id`
- Criterio:
  - listado funcional con filtros básicos.

## 2.2 Listas de audiencia (índice + detalle lectura)

- Ruta web origen: `/audience-lists`, `/audience-lists/:id`
- Requests:
  - `GET /labels/:labelId/recipient-lists`
  - `GET /labels/:labelId/recipient-lists/:listId`
  - `GET /labels/:labelId/recipient-lists/recipients`
- Criterio:
  - índice paginado y detalle con miembros.

## 2.3 Feedback (label)

- Ruta web origen: `/feedback`
- Requests:
  - `GET /labels/:labelId/releases/feedback`
  - `GET /labels/:labelId/releases/promos`
  - `GET /labels/:labelId/releases/feedback/pending-count`
- Criterio:
  - KPIs y listado de feedback visibles.

## 2.4 Destinatarios (escritura/edición)

- Requests:
  - `POST /recipients`
  - `PATCH /recipients/:id`
  - `POST /users/unsubscribe/:id`
- Criterio:
  - alta y edición básica; toggle unsubscribe estable.

## 2.5 Editar lista + bulk upload

- Requests:
  - `POST /labels/:labelId/recipient-lists`
  - `PUT /labels/:labelId/recipient-lists/:listId`
  - `DELETE /labels/:labelId/recipient-lists/:listId`
  - `DELETE .../:listId/recipients/:recipientId`
  - `POST .../:listId/recipients/bulk-upload`
- Criterio:
  - crear/renombrar/eliminar lista y carga masiva funcionando.

---

## 3. Dependencias y acuerdos

- Integrar consumo de listas con Equipo 4 (crear/editar promo).
- Mantener contrato consistente de `DestinataryList` y `Recipient`.

---

## 4. Entregables

- Módulo completo de lectura primero.
- Operaciones de escritura aisladas por feature flag si fuese necesario.
- Documentación de errores de dependencia (`409`) y mensajes al usuario.

<!-- Documento creado en colaboración con Cursor -->

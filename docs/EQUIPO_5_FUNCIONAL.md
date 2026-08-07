# Equipo 5 — Especificación funcional técnica

## Integrantes

| Rol | Nombre |
|-----|--------|
| **Team Lead (TL)** | Ferrari, Tomás |
| Integrante | Argalas, Martín |
| Integrante | Cabrera, Franco |
| Integrante | Civetta, Francesco |
| Integrante | Ferrari, Mateo |
| Integrante | Lizzi Burlando, Tomás |
| Integrante | Vitasse, Pablo Enrique |

---

Foco de equipo: Recipients, Audience Lists y Feedback (label).

Objetivo: cubrir gestión de destinatarios/listas y explotación de feedback para label.

**Contrato HTTP actual:** ver [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md). Las listas y el pool de contactos usan el prefijo **`/recipient-lists`**. Las rutas **`GET/POST/PATCH /recipients`** sin más contexto corresponden a **flujos de admin** en la API, no al panel del label tal como está implementado en r8-site. **DTOs:** [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Destinatarios (Recipients) — lectura
2. Listas de audiencia (índice) — lectura
3. Detalle lista de audiencia — lectura
4. Feedback (label) — lectura y métricas
5. Destinatarios (Recipients) — alta vía listas / pool
6. Editar lista de audiencia — edición/borrado
7. Detalle lista de audiencia — bulk upload

---

## 2. Detalle técnico por pantalla

### 2.1 Destinatarios (lectura / pool)

- Ruta web origen: `/recipients`
- Requests:
  - `GET /recipient-lists/recipients` — pool de contactos promo del label (búsqueda al agregar a una lista)
  - Para ver un contacto concreto el web resuelve por búsqueda en el pool (`getById` en cliente); no hay `GET /recipients/:id` en el flujo label del front de referencia
- Criterio:
  - listado funcional con filtros básicos en cliente.

### 2.2 Listas de audiencia (índice + detalle lectura)

- Ruta web origen: `/audience-lists`, `/audience-lists/:id`
- Requests:
  - `GET /recipient-lists` (query `page`, `limit`, `search`)
  - `GET /recipient-lists/:listId`
  - `GET /recipient-lists/:listId/recipients`
  - Pool (si la pantalla lo muestra junto al índice): `GET /recipient-lists/recipients`
- Criterio:
  - índice paginado y detalle con miembros.

### 2.3 Feedback (label)

- Ruta web origen: `/feedback`
- Requests:
  - `GET /feedback` — respuesta **`{ feedback, total }`**; filtros opcionales según la sección 8.1 de [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md)
  - `GET /feedback/pending-count`
  - `GET /feedback/analytics?dateFrom=&dateTo=` — usar **ambos** query params para acotar por fechas
  - Para contexto de promos (estadísticas cruzadas en la UI web): `GET /promos/for-label?labelId=`
- Criterio:
  - KPIs y listado de feedback visibles.

### 2.4 Destinatarios — alta y listas

- Alta de contacto en una lista (flujo web): `POST /recipient-lists/:listId/recipients` (body con `email` y/o `recipientId`, etc.)
- Toggle de baja de emails (cuando aplique): `POST /users/unsubscribe/:userId` (ver `recipientsService.toggleUnsubscription` en r8-site; el identificador es el del **usuario** contacto)
- Criterio:
  - flujo coherente con el web de referencia (no asumir `POST /recipients` para el label).

### 2.5 Editar lista + bulk upload

- Requests:
  - `POST /recipient-lists` — crear lista
  - `PUT /recipient-lists/:listId` — renombrar / actualizar
  - `DELETE /recipient-lists/:listId` — eliminar (manejar `409` y dependencias como en el web)
  - `DELETE /recipient-lists/:listId/recipients/:recipientId` — quitar miembro
  - `POST /recipient-lists/:listId/recipients/bulk-upload` — **multipart**, campo `file` (CSV, XLS o XLSX según API)
- Criterio:
  - crear/renombrar/eliminar lista y carga masiva funcionando.

---

## 3. Dependencias y acuerdos

- Integrar consumo de listas con Equipo 4 (crear/editar promo).
- Mantener contrato consistente de listas y miembros con el DTO del backend.

---

## 4. Entregables

- Módulo completo de lectura primero.
- Operaciones de escritura aisladas por feature flag si fuese necesario.
- Documentación de errores de dependencia (`409`) y mensajes al usuario.

---

*Documento creado en colaboración con Cursor.*

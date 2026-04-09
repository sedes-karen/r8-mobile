# Equipo 4 — Especificación funcional técnica

Foco de equipo: Releases y Promos (lado label).

Objetivo: cubrir lectura completa y luego creación/edición con mínima fricción.

**Contrato HTTP actual:** ver [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md). Los releases del label se listan con **`GET /releases`**; las promos del label con **`GET /promos/for-label?labelId=`**. No usar `GET /labels/:labelId/releases` ni `.../promos`. **DTOs:** [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Lista de releases — lectura
2. Detalle release — lectura
3. Lista de promos (label) — lectura
4. Detalle promo — lectura
5. Crear release
6. Editar release
7. Crear promo
8. Editar promo

---

## 2. Detalle técnico por pantalla

### 2.1 Lista de releases

- Ruta web origen: `/releases`
- Requests:
  - `GET /users/me` (para `labelId` / contexto)
  - `GET /releases` — lista del tenant (el backend filtra por JWT)
- Criterio:
  - listado y navegación a detalle.

### 2.2 Detalle release

- Ruta web origen: `/releases/:id`
- Requests:
  - `GET /releases/:releaseId` — incluye `coverUrl`, `tracks[].audioUrl` u otras URLs firmadas según respuesta
- Criterio:
  - muestra metadata, tracks y artwork.

### 2.3 Lista de promos (label)

- Ruta web origen: `/promo`
- Requests:
  - `GET /promos/for-label?labelId=<labelId>` — mismo listado que alimenta el dashboard (ver `usePromos` en r8-site)
- Criterio:
  - búsqueda/filtro/orden básico en cliente.

### 2.4 Detalle promo

- Ruta web origen: `/promo/:id` (stacks de edición en rutas hijas)
- Requests:
  - `GET /promos/:promoId` — suficiente para el detalle (validación de acceso en API)
- Criterio:
  - tabs de resumen y estados visibles.

### 2.5 Crear/Editar release

- Requests:
  - `POST /releases` — body sin forzar `labelId` (el servidor asigna el label del usuario)
  - `PATCH /releases/:releaseId`
  - Artwork (release ya creado): `PUT /releases/:releaseId/artwork` → `PUT <uploadUrl>` → `POST /releases/:releaseId/artwork/confirm` con `{ path }`
  - Audio por track: `PUT /releases/:releaseId/tracks/:trackId` → `PUT <uploadUrl>` → `POST /releases/:releaseId/tracks/:trackId/confirm`
- Criterio:
  - create/edit funcional con uploads completos.

### 2.6 Crear/Editar promo

- Requests:
  - `POST /promos` — cuerpo alineado al DTO actual (p. ej. `releaseId`, `sendType`, `recipientListIds`, `scheduledAt`; ver `CreatePromoDto` en `r8-site/src/api/promos.ts`)
  - `PATCH /promos/:id`
  - `POST /promos/:id/send`
  - `POST /promos/:id/cancel`
- Criterio:
  - creación y ajuste de listas/agenda según estado permitido.

---

## 3. Dependencias y acuerdos

- Depende de contratos de recipient lists (Equipo 5) para seleccionar listas al crear promo.
- Debe reutilizar componentes visuales de formularios compartidos.

---

## 4. Entregables

- Lectura de releases/promos estable.
- Flujos de alta/edición operativos con validaciones básicas.
- Cobertura QA de estados de envío/cancelación.

---

*Documento creado en colaboración con Cursor.*

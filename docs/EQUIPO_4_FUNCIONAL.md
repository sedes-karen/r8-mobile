# Equipo 4 — Especificación funcional técnica

Foco de equipo: Releases y Promos (lado label).

Objetivo: cubrir lectura completa y luego creación/edición con mínima fricción.

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

## 2.1 Lista de releases

- Ruta web origen: `/releases`
- Requests:
  - `GET /users/me`
  - `GET /labels/:labelId/releases`
- Criterio:
  - listado y navegación a detalle.

## 2.2 Detalle release

- Ruta web origen: `/releases/:id`
- Requests:
  - `GET /labels/:labelId/releases/:releaseId`
- Criterio:
  - muestra metadata, tracks y artwork.

## 2.3 Lista de promos (label)

- Ruta web origen: `/promo`
- Requests:
  - `GET /labels/:labelId/releases/promos`
- Criterio:
  - búsqueda/filtro/orden básico.

## 2.4 Detalle promo

- Ruta web origen: `/promo/:id`
- Requests:
  - `GET /promos/:promoId`
  - `GET /labels/:labelId/releases/:releaseId/promos/:promoId`
- Criterio:
  - tabs de resumen y estados visibles.

## 2.5 Crear/Editar release

- Requests:
  - `POST /labels/:labelId/releases`
  - `PATCH /labels/:labelId/releases/:releaseId`
  - `PUT /releases/label/:labelId/release/:releaseId/artwork`
  - `POST /releases/label/:labelId/release/:releaseId/artwork/confirm`
  - `PUT /releases/label/:labelId/release/:releaseId/tracks/:trackId`
  - `POST .../tracks/:trackId/confirm`
- Criterio:
  - create/edit funcional con uploads completos.

## 2.6 Crear/Editar promo

- Requests:
  - `POST /promos`
  - `PATCH /promos/:id`
  - `POST /promos/:id/send`
  - `POST /promos/:id/cancel`
- Criterio:
  - creación y ajuste de listas/agenda según estado permitido.

---

## 3. Dependencias y acuerdos

- Depende de contratos de recipient lists (Equipo 5).
- Debe reutilizar componentes visuales de formularios compartidos.

---

## 4. Entregables

- Lectura de releases/promos estable.
- Flujos de alta/edición operativos con validaciones básicas.
- Cobertura QA de estados de envío/cancelación.

<!-- Documento creado en colaboración con Cursor -->

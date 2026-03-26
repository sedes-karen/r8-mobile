# Equipo 2 — Especificación funcional técnica

Foco de equipo: Dashboard, Perfil Label y Analytics (label).

Objetivo: priorizar visualización de datos de label antes de CRUD avanzado.

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Dashboard (label) — lectura
2. Perfil (label) — lectura
3. Analytics (label) — lectura
4. Perfil (label) — edición parcial
5. Perfil (label) — imagen y cambio de contraseña

---

## 2. Detalle técnico por pantalla

## 2.1 Dashboard (label)

- Ruta web origen: `/dashboard`
- Requests:
  - `GET /users/me`
  - `GET /labels/:labelId/releases/promos`
- Criterio:
  - muestra datos de bienvenida y promos recientes.

## 2.2 Perfil (label) lectura

- Ruta web origen: `/profile`
- Requests:
  - `GET /users/me`
  - `GET /labels/:labelId/profile-image`
- Criterio:
  - renderiza datos principales del label y redes.

## 2.3 Analytics (label)

- Ruta web origen: `/analytics`
- Requests:
  - `GET /users/me`
  - `GET /labels/:labelId/releases`
  - `GET /labels/:labelId/releases/feedback`
- Criterio:
  - selector de release + métricas base visibles.

## 2.4 Perfil (label) edición parcial

- Requests:
  - `PUT /labels/:labelId`
- Criterio:
  - edición de nombre, descripción y URLs sociales.

## 2.5 Perfil (label) imagen + password

- Requests:
  - `POST /labels/:labelId/profile-image`
  - `PUT <uploadUrl>`
  - `POST /labels/:labelId/profile-image/confirm`
  - `POST /users/me/change-password`
- Criterio:
  - completa flujo imagen.
  - cambio de contraseña con feedback visual.

---

## 3. Dependencias y acuerdos

- Consume sesión resuelta por Equipo 1.
- Debe exponer componentes reutilizables de perfil para consistencia visual.

---

## 4. Entregables

- Pantallas de lectura estables primero.
- CRUD parcial luego, sin romper lectura.
- Documentación de campos editables/no editables.

<!-- Documento creado en colaboración con Cursor -->

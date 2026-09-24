# Equipo 2 — Especificación funcional técnica

## Integrantes

| Rol | Nombre |
|-----|--------|
| **Team Lead (TL)** | Etchepare, Mateo |
| Integrante | Cardinaux, Daiana Elizabeth |
| Integrante | Denoni, Verónica Camila |
| Integrante | Galo Roig, Damián |
| Integrante | Montechiarini, Juan Ignacio |
| Integrante | Peralta, Maximiliano Agustín |
| Integrante | Rodríguez, Enzo Alejandro |
| Integrante | Romani, Nicolás |

---

Foco de equipo: Dashboard, Perfil Label y Analytics (label).

Objetivo: priorizar visualización de datos de label antes de CRUD avanzado.

**Contrato HTTP actual:** ver [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md). El perfil del propio label y el dashboard **no** usan `GET /labels/:labelId/...` con el id en la ruta para el “yo”; se usa **`/labels/me`** y **`/promos/for-label`**. **DTOs:** [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Dashboard (label) — lectura
2. Perfil (label) — lectura
3. Analytics (label) — lectura
4. Perfil (label) — edición parcial
5. Perfil (label) — imagen y cambio de contraseña

---

## 2. Detalle técnico por pantalla

### 2.1 Dashboard (label)

- Ruta web origen: `/dashboard`
- Requests:
  - `GET /users/me` (incluye `labelId` cuando aplica)
  - `GET /promos/for-label?labelId=<labelId>` — listado de promos del label (mismo endpoint que usa el listado de `/promo` en el web; ver `usePromos` / `promosService.getDashboard` en r8-site)
- Criterio:
  - muestra datos de bienvenida y promos recientes.

### 2.2 Perfil (label) lectura

- Ruta web origen: `/profile`
- Requests:
  - `GET /users/me`
  - `GET /labels/me` (datos del sello)
  - Avatar: `GET /labels/me/profile-image` → URL firmada o `{ url }` según respuesta
- Criterio:
  - renderiza datos principales del label y redes.

### 2.3 Analytics (label)

- Ruta web origen: `/analytics`
- Requests:
  - `GET /users/me`
  - `GET /releases` — catálogo del tenant (equivalente a “releases del label”; **no** existe `GET /labels/:labelId/releases` en el flujo web actual)
  - `GET /feedback` — respuesta **`{ feedback, total }`**; filtros en query según DTOs §8.1 (**sin** `dateFrom`/`dateTo` — usar `GET /feedback/analytics` para rango)
  - (Opcional) `GET /feedback/analytics?dateFrom=...&dateTo=...` — **incluir ambas** fechas si se quiere un rango explícito (mismo criterio que la API)
- Criterio:
  - selector de release + métricas base visibles (la pantalla web cruza releases + feedback en cliente).

### 2.4 Perfil (label) edición parcial

- Requests:
  - `PUT /labels/me` (nombre, descripción, URLs; **no** `PUT /labels/:labelId` para el perfil propio)
- Criterio:
  - edición de nombre, descripción y URLs sociales.

### 2.5 Perfil (label) imagen + password

- Requests:
  - Imagen (igual patrón que artista): `POST /labels/me/profile-image` → `PUT <uploadUrl>` → `POST /labels/me/profile-image/confirm` con `{ path }`
  - Contraseña: `POST /users/me/change-password` — tras éxito, revoca cookies refresh (re-login necesario en mobile hasta implementar refresh)
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

---

*Documento creado en colaboración con Cursor.*

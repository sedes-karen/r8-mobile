# Equipo 2 — Especificación funcional técnica

## Integrantes

| Rol | Nombre | Usuario GitHub |
|-----|--------|----------------|
| **Team Lead (TL)** | Etchepare, Mateo | MateoEtchepareDev |
| Integrante | Cardinaux, Daiana Elizabeth | DaianaCardinaux |
| Integrante | Denoni, Verónica Camila | Camiladenoni |
| Integrante | Galo Roig, Damián | galoroig |
| Integrante | Montechiarini, Juan Ignacio | Juanimonte10 |
| Integrante | Peralta, Maximiliano Agustín | Maximiliano-A-P |
| Integrante | Rodríguez, Enzo Alejandro | Enzorod20 |
| Integrante | Romani, Nicolás | NicopRomani |

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
  - `GET /feedback` — respuesta **`{ feedback, total }`**; filtros en query según DTOs §8.1 (`dateFrom`+`dateTo` **juntos** acotan `createdAt`; `submittedOnly=true` opcional)
  - (Opcional) `GET /feedback/analytics?dateFrom=...&dateTo=...` — **incluir ambas** fechas si se quiere un rango explícito
  - (Opcional) `GET /feedback/geo-density` — buckets de mapa (país/ciudad + plays/feedback/downloads/supports/likes)
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
| Etchepare, Mateo | 1 abierto | Cumple | Cumple | Cumple | En camino |
| Cardinaux, Daiana Elizabeth | 1 abierto | Cumple | En camino | En camino | Cumple |
| Denoni, Verónica Camila | 0 | Sin evidencia | — | — | — |
| Galo Roig, Damián | 1 abierto | Cumple | Cumple | En camino | Cumple |
| Montechiarini, Juan Ignacio | 0 | Sin evidencia | — | — | — |
| Peralta, Maximiliano Agustín | 1 abierto · 3 cerrados | Cumple | En camino | En camino | En camino |
| Rodríguez, Enzo Alejandro | 0 | Sin evidencia | — | — | — |
| Romani, Nicolás | 0 | Sin evidencia | — | — | — |

### Notas y recomendaciones

**Etchepare, Mateo** (`MateoEtchepareDev`) — El #29 es un slice de verdad (perfil label lectura/edición + imagen + password). Sumá descripción al PR (qué endpoints, cómo probarlo) y evitá mandar `package-lock` si no hace falta. Está un paso más adelante que el orden “lectura primero”: está bien si la lectura queda usable.

**Cardinaux, Daiana Elizabeth** (`DaianaCardinaux`) — Dashboard en un solo archivo (#32): alcance correcto. Falta descripción y, para el DoD, estados loading/error/vacío + datos (mock o API). Coordiná con Peralta: ustedes dos están tocando Dashboard/Card.

**Denoni, Verónica Camila** (`Camiladenoni`) — Sin PRs ni commits. Un primer PR de lectura (por ejemplo Analytics o un estado vacío del dashboard) alcanza para aparecer en el rastro.

**Galo Roig, Damián** (`galoroig`) — Hook + tipos de perfil (#31) bien acotados. El siguiente paso es engancharlo a `Label/Profile/View` para que deje de ser solo capa de datos. Cuidado: Etchepare también toca `useLabelProfile` en el #29.

**Montechiarini, Juan Ignacio** (`Juanimonte10`) — Sin PRs ni commits. Hablemos en clase de un recorte (Analytics lectura o edición de un campo del perfil).

**Peralta, Maximiliano Agustín** (`Maximiliano-A-P`) — Hay rastro de sobra (dashboard + Card), pero tres PRs cerrados y el #48 otra vez con Card. Cerrá el ciclo: un PR vigente, descripción, y que Card no duplique `ListRowCard` si ya está en `main`.

**Rodríguez, Enzo Alejandro** (`Enzorod20`) — Sin PRs ni commits. Primer PR esta semana, aunque sea un átomo o el cableado de un hook que ya exista.

**Romani, Nicolás** (`NicopRomani`) — Sin PRs ni commits. Mismo pedido: un cambio chico y con PR, no trabajo solo local.

---

*Documento creado en colaboración con Cursor.*

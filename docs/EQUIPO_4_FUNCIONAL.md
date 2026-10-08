# Equipo 4 — Especificación funcional técnica

## Integrantes

| Rol | Nombre | Usuario GitHub |
|-----|--------|----------------|
| **Team Lead (TL)** | Figún, Valentín | vfigunn |
| Integrante | Gallop, Román | RomanGallop |
| Integrante | Haunau, Paula Rocío | phaunau |
| Integrante | Morales, Matías Valentino | matiasm0rales |
| Integrante | Ramos, Agustín | agustinIgnacioRamos |
| Integrante | Ronconi, Francisca Mailen | RonconiFrancisca |
| Integrante | Veronesi, Sofía | sofia-veronesi3 |

---

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
  - `GET /releases` — respuesta **`{ releases: [...], hostingQuota: { used }, releaseAudioQuota? }`** (`used` = conteo de releases con audio, no bytes); el backend filtra por JWT
- Enums válidos al crear/editar: `type` → **`EP` | `VA` | `ALBUM`**; `status` → **`DRAFT` | `CREATED`**; `formats` opcional → `DIGITAL` | `VINYL` (ver [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md) §5)
- Criterio:
  - listado y navegación a detalle.

### 2.2 Detalle release

- Ruta web origen: `/releases/:id`
- Requests:
  - `GET /releases/:releaseId` — incluye `coverUrl`, `tracks[].audioUrl` u otras URLs firmadas según respuesta
  - (Opcional) compartir dashboard de feedback: `GET /releases/:releaseId/share-token` → `{ token }`; el enlace público consume `GET /releases/shared/:token` (sin login)
- Criterio:
  - muestra metadata, tracks y artwork.

### 2.3 Lista de promos (label)

- Ruta web origen: `/promo`
- Requests:
  - `GET /promos/for-label?labelId=<labelId>` — listado de promos del label (**no** usar `GET /promos` global, reservado a admin)
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
| Figún, Valentín | 2 merge · 2 cerrados | Destaca | Cumple | Cumple | Cumple |
| Gallop, Román | 0 | Sin evidencia | — | — | — |
| Haunau, Paula Rocío | 1 cerrado | En camino | Cumple | En camino | En camino |
| Morales, Matías Valentino | 1 cerrado | Cumple | Cumple | Cumple | En camino |
| Ramos, Agustín | 1 merge · 1 cerrado | Cumple | Cumple | Cumple | Cumple |
| Ronconi, Francisca Mailen | 1 abierto | Cumple | En camino | En camino | En camino |
| Veronesi, Sofía | 1 merge | Cumple | Cumple | Cumple | Cumple |

### Notas y recomendaciones

**Figún, Valentín** (`vfigunn`) — Lista de releases + `useReleases` (#36) y `MetaDataRow` (#35) mergeados: el recorte de lectura está. Los PRs viejos cerrados (#4, #13) ya no hace falta reabrirlos; el foco ahora es detalle/alta sin volver a mezclar tipos + API + pantalla en el mismo diff.

**Gallop, Román** (`RomanGallop`) — Sin PRs ni commits. Un PR de lectura (lista o detalle de promos) esta semana; lo vemos en clase.

**Haunau, Paula Rocío** (`phaunau`) — El #3 (lista mock) quedó cerrado y en la ruta vieja `screens/releases/`. Rehacé el recorte sobre `screens/Label/Releases/` (o sumate al detalle/promos) en un PR nuevo.

**Morales, Matías Valentino** (`matiasm0rales`) — El #14 (moléculas de estado) tenía buen criterio, pero se mezcló con API/tipos y no mergeó. Reenviá solo Empty/Error/Loading si aún no están en `main`, sin el resto.

**Ramos, Agustín** (`agustinIgnacioRamos`) — SearchField mergeado (#46) y la capa API (#15) aunque no haya entrado: hay intención clara. El #15 cerrado se puede retomar partido (un client, sin duplicar el de Clase 4).

**Ronconi, Francisca Mailen** (`RonconiFrancisca`) — Details de release (#50) es el recorte correcto. Poné descripción y estados loading/error; el path `feactures` de un commit viejo no lo repitas.

**Veronesi, Sofía** (`sofia-veronesi3`) — `ListRowCard` mergeado (#49) y el hook `useReleases` en historial: bien. El siguiente paso natural es usarlo en una pantalla que todavía sea stub (detalle o lista de promos), no otro átomo suelto.

---

*Documento creado en colaboración con Cursor.*

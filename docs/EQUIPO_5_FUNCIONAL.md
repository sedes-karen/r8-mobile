# Equipo 5 — Especificación funcional técnica

## Integrantes

| Rol | Nombre | Usuario GitHub |
|-----|--------|----------------|
| **Team Lead (TL)** | Ferrari, Tomás | FTInform |
| Integrante | Argalas, Martín | martin20021027 |
| Integrante | Cabrera, Franco | AguanteBoca06 |
| Integrante | Civetta, Francesco | elpeco123 |
| Integrante | Ferrari, Mateo | Mateo150905 |
| Integrante | Lizzi Burlando, Tomás | LizziTomas |
| Integrante | Vitasse, Pablo Enrique | Pablo-Vit |

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
  - `GET /feedback` — respuesta **`{ feedback, total }`** (entidades crudas); filtros opcionales según DTOs §8.1 (`dateFrom`+`dateTo` **juntos**, `submittedOnly=true`)
  - `GET /feedback/pending-count`
  - `GET /feedback/analytics?dateFrom=&dateTo=` — usar **ambos** query params para el rango de analytics
  - (Opcional) `GET /feedback/geo-density` — mapa de densidad
  - Para contexto de promos (estadísticas cruzadas en la UI web): `GET /promos/for-label?labelId=`
- Criterio:
  - KPIs y listado de feedback visibles.

### 2.4 Destinatarios — alta y listas

- Alta de contacto en una lista (flujo web): `POST /recipient-lists/:listId/recipients` (body con `email` y/o `recipientId`, etc.)
- Toggle de baja de emails (cuando aplique): `GET /users/unsubscribe/token-status` (**204** si el link es válido, sin aplicar baja) y luego `POST /users/unsubscribe` (Bearer; **no** incluir `userId` en la URL). Con contacto promo: `?token=` según [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md)
- Criterio:
  - flujo coherente con el web de referencia (no asumir `POST /recipients` para el label).

### 2.5 Editar lista + bulk upload (batch)

- Requests:
  - `POST /recipient-lists` — crear lista
  - `PUT /recipient-lists/:listId` — renombrar / actualizar
  - `DELETE /recipient-lists/:listId` — eliminar (manejar `409` y dependencias como en el web)
  - `DELETE /recipient-lists/:listId/recipients/:recipientId` — quitar miembro
  - `POST /recipient-lists/:listId/recipients/batch` — JSON con **exactamente uno** de:
    - `{ "recipientIds": ["uuid", ...] }` — IDs ya en el pool del label
    - `{ "recipients": [{ "email", "display_name?" }] }` — emails nuevos (find-or-create)
  - **No** existe `bulk-upload` multipart en la API: parsear CSV/Excel **en el dispositivo** (como `r8-site`) y enviar `recipients[]`
- Criterio:
  - crear/renombrar/eliminar lista y carga masiva funcionando; respuesta batch `{ added, skipped }`.

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
| Ferrari, Tomás | 1 abierto | Cumple | Destaca | Cumple | Cumple |
| Argalas, Martín | 0 | Sin evidencia | — | — | — |
| Cabrera, Franco | 0 | Sin evidencia | — | — | — |
| Civetta, Francesco | 0 | Sin evidencia | — | — | — |
| Ferrari, Mateo | 0 | Sin evidencia | — | — | — |
| Lizzi Burlando, Tomás | 0 | Sin evidencia | — | — | — |
| Vitasse, Pablo Enrique | 0 | Sin evidencia | — | — | — |

### Notas y recomendaciones

**Ferrari, Tomás** (`FTInform`) — El #45 (detalle de lista + API + Badge/row) es el modelo de PR del equipo: un recorte, explicación y archivos en el lugar correcto. Hay commits de `EnzoPeverelli` (Equipo 3) en ese PR: si fue pair, anotalo; si no, que cada quien pushee en su rama. El cuello de botella ahora no es el TL, es que el resto no tiene rastro.

**Argalas, Martín** (`martin20021027`) — Sin PRs ni commits. Recorte posible: índice de listas (`RecipientLists/List`) con `deliverySummary`. Lo vemos en clase.

**Cabrera, Franco** (`AguanteBoca06`) — Sin PRs ni commits. Recorte posible: pool de destinatarios o el alta de un miembro a una lista.

**Civetta, Francesco** (`elpeco123`) — Sin PRs ni commits. Recorte posible: Feedback label (listado lectura) o `pending-count`.

**Ferrari, Mateo** (`Mateo150905`) — Sin PRs ni commits. Podés partir el #45: miembros de la lista, o el batch/CSV parseado en cliente, en un PR tuyo.

**Lizzi Burlando, Tomás** (`LizziTomas`) — Sin PRs ni commits. Recorte posible: crear/renombrar lista (`POST/PUT /recipient-lists`) después de que el detalle mergee.

**Vitasse, Pablo Enrique** (`Pablo-Vit`) — Sin PRs ni commits. Recorte posible: quitar miembro o estados de error `409` con mensaje al usuario.

---

*Documento creado en colaboración con Cursor.*

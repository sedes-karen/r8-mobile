# Equipo 1 — Especificación funcional técnica

## Integrantes

| Rol | Nombre | Usuario GitHub |
|-----|--------|----------------|
| **Team Lead (TL)** | Galarraga, Ignacio David | David-Galarraga |
| Integrante | Fuchs, María Yanina | Fuchs-Yani |
| Integrante | Hauscarriaga, Matías Gabriel | MatiasHauscarriaga |
| Integrante | Martinez, Cecilia | ceciliamartinez24 |
| Integrante | Molina Paiva, Sebastián Ismael | ismaelpascal |
| Integrante | Murillo, Ángel Daniel | AngelMurillo1 |
| Integrante | Planchón, Tomás Eduardo | PlanchonTomas |
| Integrante | Zabala, Daniel Esteban | DanielEZabala |

---

Foco de equipo: Autenticación, bootstrap y Perfil Artista (prioridad máxima del proyecto).

Objetivo: dejar completo el flujo de entrada y el perfil del artista, asegurando navegación por rol.

**Contrato HTTP actual:** ver [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md) (ya no se usan rutas anidadas bajo `/labels/:labelId/...` para releases ni promos). **DTOs de cada request:** [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

## 1. Orden de pantallas (lectura -> escritura/edición)

1. Splash / bootstrap (lectura de sesión/perfil)
2. Perfil artista (modo player) — lectura
3. Login
4. Registro
5. Recuperación de contraseña
6. Perfil artista (modo player) — edición + imagen

---

## 2. Detalle técnico por pantalla

### 2.1 Splash / bootstrap

- Ruta web origen: `/`
- Objetivo RN: resolver sesión y stack por rol.
- Requests:
  - `POST /auth/refresh` (cookie de refresh; ver nota móvil en referencia API)
  - `GET /users/me` (perfil y roles tras sesión válida)
- Criterio de aceptación:
  - redirige correctamente a stack label o artist/recipient.
  - maneja token ausente/expirado sin romper app.
- **Desarrollo (corto plazo):** menú o flag dev en `AuthInfoProvider` con `{ isAuthenticated: true, role: 'label' | 'artist' }` para probar stacks sin login real (ver [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md) § Autenticación en React Native).

### 2.2 Perfil artista (lectura)

- Ruta web origen: `/promos-player` (vista perfil según UI web)
- Requests:
  - `GET /users/me`
  - `GET /artists/me` (datos de artista si aplica)
  - `GET /artists/me/profile-image` → `{ url }` para avatar (equivalente en `r8-site`: `artistService.getProfileImageUrl`)
- Criterio:
  - muestra nombre, bio, redes y avatar.
  - estados loading, vacío, error.

### 2.3 Login

- Ruta web origen: `/login`
- Requests:
  - `POST /auth/login` → respuesta incluye **`accessToken`** (guardar y enviar `Authorization: Bearer`)
  - `GET /users/me` (post login)
- Criterio:
  - guarda sesión y navega según rol.
  - si el API responde **403** `"Email verification required"`, redirigir al paso PIN (`POST /users/verify-email` / reenvío).

### 2.4 Registro

- Ruta web origen: `/register` (flujo en dos pasos, igual que r8-site)
- Requests:
  1. `POST /users/register` → **201** `{ requiresEmailVerification: true, email }` (**sin** `accessToken`; usuario `EMAIL_NOT_VERIFIED`)
  2. `POST /users/verify-email` con `{ email, pin }` → **200** + `accessToken` + cookie
  3. Opcional: `POST /users/resend-verification` con `{ email }`
  4. `GET /users/me` (tras verify)
  - Alternativa promo: `POST /users/register?token=<jwt_contacto>` — completa cuenta **sin** PIN (solo `password` obligatorio; ver DTOs §2) y emite sesión al instante
- Criterio:
  - pantalla de PIN tras el alta abierta; sesión solo después de verify (o registro promo).
  - alta correcta por rol y navegación posterior.

### 2.5 Recuperación de contraseña

- Ruta web origen: `/password-reset`
- Requests:
  - `POST /users/password/request-reset`
  - `POST /users/password/reset`
- Criterio:
  - flujo en dos pasos funcional y validado (mismo contrato que `r8-site/src/api/user.ts`).

### 2.6 Perfil artista (edición + imagen)

- Requests:
  - `PUT /artists/me` (texto / redes)
  - Imagen (presign + subida directa + confirm), alineado al web:
    - `POST /artists/me/profile-image` (body p. ej. `{ contentType }`) → `uploadUrl`, `path`
    - `PUT <uploadUrl>` con el binario (mismo `Content-Type`)
    - `POST /artists/me/profile-image/confirm` con `{ path }`
- Criterio:
  - persiste cambios de texto.
  - subida de imagen completa (presign + upload + confirm).
- Si la cuenta ya es label y quiere perfil artista (o al revés): `POST /users/me/activate-profile` con `{ "type": "artist" | "label", "name" }` → **201** (mismo shape que `GET /users/me`).

---

## 3. Dependencias y acuerdos

- Requiere base de navegación común.
- Debe exponer helpers de sesión reutilizables para otros equipos.
- Entregar contratos tipados en `services/api` (o capa equivalente).

---

## 4. Entregables

- Pantallas implementadas con manejo de errores.
- Pruebas manuales smoke.
- Nota técnica de endpoints y casos borde.

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
| Galarraga, Ignacio David | 1 merge · 1 cerrado | Cumple | Cumple | Cumple | En camino |
| Fuchs, María Yanina | 1 abierto | Cumple | Cumple | En camino | En camino |
| Hauscarriaga, Matías Gabriel | 0 PRs · 1 commit | En camino | En camino | En camino | En camino |
| Martinez, Cecilia | 1 merge · 1 abierto · 1 cerrado | Cumple | En camino | Cumple | En camino |
| Molina Paiva, Sebastián Ismael | 3 merge · 2 abiertos · 1 cerrado | Destaca | Cumple | Cumple | En camino |
| Murillo, Ángel Daniel | 0 | Sin evidencia | — | — | — |
| Planchón, Tomás Eduardo | 0 | Sin evidencia | — | — | — |
| Zabala, Daniel Esteban | 0 | Sin evidencia | — | — | — |

### Notas y recomendaciones

**Galarraga, Ignacio David** (`David-Galarraga`) — Avatar mergeado (#9) está bien acotado. El #10 (ErrorMessage) quedó cerrado: o lo reabrís limpio (sin volver a mandar Avatar) o confirmamos que el átomo ya está en `main` por otro lado.

**Fuchs, María Yanina** (`Fuchs-Yani`) — El #47 conecta PasswordReset y avisa las dependencias (#37 y #44): buena intención. No hace falta reenviar los organismos que ya están en esos PRs; cuando mergeen, tu PR puede quedar solo con la pantalla.

**Hauscarriaga, Matías Gabriel** (`MatiasHauscarriaga`) — Hay un commit suelto en `auth/info.tsx` y ningún PR a tu nombre. Abrí un PR aunque sea chico (un átomo o un ajuste de sesión) para que el rastro sea revisable.

**Martinez, Cecilia** (`ceciliamartinez24`) — RegisterForm ya mergeó (#41). El #44 parece el mismo archivo otra vez y el Login (#28) quedó cerrado: unificá. Completá la descripción del PR (qué hace, cómo probarlo).

**Molina Paiva, Sebastián Ismael** (`ismaelpascal`) — El rastro es el más claro del equipo (Button, Input, auth UI). El #38 (`preview.html`) no entra al producto RN: dejalo como referencia fuera del repo. Coordiná con Fuchs y Martinez: hay solapamiento de archivos entre #37, #44 y #47.

**Murillo, Ángel Daniel** (`AngelMurillo1`) — Sin PRs ni commits. Traé un primer PR esta semana aunque sea un átomo o un estado (loading/error); lo vemos en clase.

**Planchón, Tomás Eduardo** (`PlanchonTomas`) — Sin PRs ni commits. Mismo pedido: un PR chico y revisable, no un bloque enorme.

**Zabala, Daniel Esteban** (`DanielEZabala`) — Sin PRs ni commits. Hablemos en clase del recorte (por ejemplo Splash o un estado de Auth) para que aparezca en GitHub.

---

*Documento creado en colaboración con Cursor.*

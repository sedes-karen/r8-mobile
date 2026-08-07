# Equipo 1 — Especificación funcional técnica

## Integrantes

| Rol | Nombre |
|-----|--------|
| **Team Lead (TL)** | Galarraga, Ignacio David |
| Integrante | Fuchs, María Yanina |
| Integrante | Hauscarriaga, Matías Gabriel |
| Integrante | Martinez, Cecilia |
| Integrante | Molina Paiva, Sebastián Ismael |
| Integrante | Murillo, Ángel Daniel |
| Integrante | Planchón, Tomás Eduardo |
| Integrante | Zabala, Daniel Esteban |

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

### 2.4 Registro

- Ruta web origen: `/register`
- Requests:
  - `POST /users/register` (mismo patrón de `accessToken` + cookies que login)
  - `GET /users/me` (post register)
- Criterio:
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

*Documento creado en colaboración con Cursor.*

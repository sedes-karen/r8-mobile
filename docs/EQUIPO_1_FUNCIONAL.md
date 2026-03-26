# Equipo 1 — Especificación funcional técnica

Foco de equipo: Autenticación, bootstrap y Perfil Artista (prioridad máxima del proyecto).

Objetivo: dejar completo el flujo de entrada y el perfil del artista, asegurando navegación por rol.

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

## 2.1 Splash / bootstrap

- Ruta web origen: `/`
- Objetivo RN: resolver sesión y stack por rol.
- Requests:
  - `POST /auth/refresh`
  - `GET /users/me`
- Criterio de aceptación:
  - redirige correctamente a stack label o artist/recipient.
  - maneja token ausente/expirado sin romper app.

## 2.2 Perfil artista (lectura)

- Ruta web origen: `/promos-player?view=profile`
- Requests:
  - `GET /users/me`
  - `GET /artists/me/profile-image`
- Criterio:
  - muestra nombre, bio, redes y avatar.
  - estados loading, vacío, error.

## 2.3 Login

- Ruta web origen: `/login`
- Requests:
  - `POST /auth/login`
  - `GET /users/me` (post login)
- Criterio:
  - guarda sesión y navega según rol.

## 2.4 Registro

- Ruta web origen: `/register`
- Requests:
  - `POST /users/register`
  - `GET /users/me` (post register)
- Criterio:
  - alta correcta por rol y navegación posterior.

## 2.5 Recuperación de contraseña

- Ruta web origen: `/password-reset`
- Requests:
  - `POST /users/password/request-reset`
  - `POST /users/password/reset`
- Criterio:
  - flujo en dos pasos funcional y validado.

## 2.6 Perfil artista (edición + imagen)

- Requests:
  - `PUT /artists/me`
  - `POST /artists/me/profile-image`
  - `PUT <uploadUrl>`
  - `POST /artists/me/profile-image/confirm`
- Criterio:
  - persiste cambios de texto.
  - subida de imagen completa (presign + upload + confirm).

---

## 3. Dependencias y acuerdos

- Requiere base de navegación común.
- Debe exponer helpers de sesión reutilizables para otros equipos.
- Entregar contratos tipados en `services/api`.

---

## 4. Entregables

- Pantallas implementadas con manejo de errores.
- Pruebas manuales smoke.
- Nota técnica de endpoints y casos borde.

<!-- Documento creado en colaboración con Cursor -->

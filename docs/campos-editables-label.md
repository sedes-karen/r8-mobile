# Perfil del label — campos editables y no editables

Alcance: pantallas `Label/Profile/View` y `Label/Profile/Edit` (datos del sello, imagen y
contraseña). Las pantallas de Artist no se documentan acá.

Contrato completo: [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md),
[DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md) §3.

---

## 1. Endpoints que usa el perfil

| Método | Endpoint | Body | Respuesta | Uso en la app |
|--------|----------|------|-----------|---------------|
| `GET` | `/labels/me` | — | `LabelProfile` (camelCase) | lectura (`useLabelProfile`) |
| `PUT` | `/labels/me` | `UpdateLabelDto` (todos opcionales) | label actualizado | guardar datos (`useUpdateLabelProfile`) |
| `POST` | `/labels/me/profile-image` | `{ contentType }` | **201** `{ uploadUrl, expiresIn, path }` | presign de la imagen |
| `PUT` | `<uploadUrl>` | binario | según storage | subida del archivo |
| `POST` | `/labels/me/profile-image/confirm` | `{ path }` | **201** sin body | confirmar la subida |
| `GET` | `/labels/me/profile-image` | — | `{ url: string \| null, expiresAt?: string }` | refrescar el avatar |
| `POST` | `/users/me/change-password` | `{ currentPassword, newPassword }` | `{ message }` | cambio de contraseña |

Aclaraciones de entidad:

- Los datos del sello (incluidas las redes) se editan con **`PUT /labels/me`**.
- No se usa `PUT /users/me`: el backend también acepta socials ahí, pero esa no es la vía del
  perfil del sello.
- No se usa `PUT /labels/:labelId`: ese CRUD es de admin/operación, no del propio label.

---

## 2. Campos

| Campo | Editable | Vía | Notas |
|-------|----------|-----|-------|
| `name` | Sí | `PUT /labels/me` | input "Nombre"; en la respuesta puede venir `null` |
| `description` | Sí | `PUT /labels/me` | input multilínea |
| `instagramUrl` | Sí | `PUT /labels/me` | texto libre, sin normalizar |
| `soundcloudUrl` | Sí | `PUT /labels/me` | texto libre, sin normalizar |
| `bandcampUrl` | Sí | `PUT /labels/me` | texto libre, sin normalizar |
| `twitterUrl` | Sí | `PUT /labels/me` | texto libre, sin normalizar |
| `profileImagePath` | No | — | el DTO lo acepta, pero la app no lo escribe: pisaría el path del storage. La imagen va por presign (§3) |
| `profileImageUrl` | No | derivado | URL firmada; sale de `GET /labels/me` o de `GET /labels/me/profile-image` |
| `id` | No | — | identidad |
| `userId` | No | — | identidad |
| `createdAt` | No | — | auditoría |
| `updatedAt` | No | — | auditoría |
| contraseña | Sí | `POST /users/me/change-password` | no es un campo del label; revoca el refresh token, así que la app cierra sesión tras el 200 |

En el formulario, un campo de texto vacío se manda como `undefined` (no como `""`), así el
`PUT` no borra datos por accidente.

---

## 3. Imagen de perfil (presign → PUT → confirm)

1. `POST /labels/me/profile-image` con el `contentType` del asset → `{ uploadUrl, path }`.
2. `PUT <uploadUrl>` con el binario y el mismo `Content-Type`.
3. `POST /labels/me/profile-image/confirm` con `{ path }` → **201** sin body.
4. Para mostrar la imagen nueva: `GET /labels/me` (trae `profileImageUrl`) o
   `GET /labels/me/profile-image` → `{ url }`. La URL es firmada y vence (`expiresAt`), no
   conviene cachearla.

El `confirm` **no** devuelve la URL: si se necesita, hay que pedirla después.

---

## 4. Contraseña

`POST /users/me/change-password`. Valida en el cliente: mínimo 6 caracteres para la nueva y
que coincida con la confirmación. El backend revoca el refresh token, por eso la app hace
`logout()` después del 200 (en mobile todavía no hay refresh propio).

---

## 5. Validaciones de la app

- Contraseña: mínimo 6 caracteres y coincidencia (`LabelProfileImagePasswordForm`).
- Datos del sello: hoy no hay validación por campo (nombre no vacío, formato de URLs). Queda
  pendiente en la issue #85; hasta entonces el `PUT` es la única validación real.

---

## 6. Cómo probar

Automático:

```bash
npx tsc --noEmit
npm test
```

Manual (contra stage, con sesión de label):

1. `GET /labels/me` → anotar los datos actuales.
2. Perfil → Editar → cambiar nombre, descripción y una URL → guardar → `GET /labels/me`
   refleja los cambios.
3. Dejar un campo de texto vacío y guardar → el `PUT` no manda ese campo (no borra el valor).
4. Cambiar imagen → confirmar que `GET /labels/me/profile-image` devuelve `url` no nulo.
5. Cambiar contraseña → la app vuelve al login y el token anterior ya no sirve.

---

## 7. Dónde vive en el código

- Pantallas: `src/screens/Label/Profile/View.tsx`, `src/screens/Label/Profile/Edit.tsx`
- Formularios: `src/components/organisms/LabelProfileDataForm.tsx`,
  `src/components/organisms/LabelProfileImagePasswordForm.tsx`
- Hooks: `src/features/label/useLabelProfile.ts`, `useUpdateLabelProfile.ts`,
  `useLabelImage.ts`, `useChangePassword.ts`
- Servicios: `src/services/api/labelsApi.ts`, `src/services/api/userApi.ts`
- Tipos: `src/types/label/index.ts`

Estado actual: `PUT /labels/me` y el cambio de contraseña ya pegan al backend. El hook real de
imagen (`presign → PUT → confirm`) está en `src/hooks/useLabelImage.ts` pero todavía no está
cableado a `Edit.tsx`: `src/features/label/useLabelImage.ts` sigue siendo el stub, y su
cableado es el alcance de #84.

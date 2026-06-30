# Común para todos los roles

- Auth: Autenticación en general
  - Splash: Bootstrap de sesión (`POST /auth/refresh` + `GET /users/me`) — **pendiente en navegación**; Equipo 1
  - Login: Inicio de sesión
  - Signup: Registro
  - PasswordReset: Recuperación de contraseña

## Navegación (decisión del curso, jun 2026)

| Tema | Decisión |
|------|----------|
| **Tabs vs stacks** | Hasta segunda mitad del cursado, los **stacks anidados actuales** en `src/navigation/index.tsx` son **aceptables** y no bloquean entregas. Bottom tabs (Artist: Promos / Profile; Label: Dashboard, Releases, Lists, etc.) quedan como **mejora UX opcional** en Fase 3+. |
| **Splash** | Pantalla inicial que resuelve sesión antes de Login o stack por rol. Se cuelga del stack Auth o del root con `initialRouteName` dinámico. |
| **Guest / player sin login** | Flujo **separado** del stack Artist autenticado: deep link o pantalla Player con `?token=` en las llamadas API (ver [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md)). No exige `useIsArtist` con Bearer. |

Detalle de deuda técnica y prioridades: [CLASE_03_PRACTICA_B.md](./_Clases_Practicas/CLASE_03_PRACTICA_B.md).

---

# Pantallas solo del artista

- Promos: Flujo **guest** con `?token=` o artista autenticado con Bearer. No es obligatorio login para el inbox de contacto promo (ver REFERENCIA_API § inbox).
  - Player: Lista las promos recibidas (inbox), incluyendo el contador de pendientes
  - Details(promo-id): Detalle de una promo, reproductor de audio, botones de feedback/dismiss
  - Feedback(promo-id): Formulario para enviar retroalimentación sobre una promo específica
  - LikedTracks: Lista de canciones favoritas
- Profile: Perfil del artista
  - View
  - Edit

# Pantallas solo del label

- Dashboard: dashboard del label
- Profile: Perfil del label
- Analytics: Información agregada por release, por fecha, etc
- Releases: CRUD de releases
  - List
  - New
  - Details
  - Edit
  - Promos: CRUD de promos (están atadas a un release particular)
    - List(release-id)
    - New(release-id): Crea una promo en una release específica
    - Details(promo-id)
    - Edit(promo-id)
- RecipientLists
  - List
  - New
  - Details(recipient-list-id)
  - Edit(recipient-list-id)
  - Feedback
  - BulkUpload — parseo CSV/Excel **en el dispositivo** → `POST .../recipients/batch` (JSON, no multipart al API)
  - alta de destinatario en lista

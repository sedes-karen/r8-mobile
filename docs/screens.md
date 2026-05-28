# Común para todos

- Auth: Autenticación en general
  - Login: Inicio de sesión
  - Signup: Registro
  - PasswordReset: Recuperación de contraseña

# Rutas solo del artista

- Promos: Es posible que este grupo pueda accederse sin estar autenticado. Requiere clarificación
  - Player: Lista las promos recibidas (inbox), incluyendo el contador de pendientes
  - PromoDetail(promo-id): Detalle de una promo, reproductor de audio, botones de feedback/dismiss
  - Feedback(promo-id): Formulario para enviar retroalimentación sobre una promo específica
  - LikedTracks: Lista de canciones favoritas
- Profile: Perfil del artista
  - View
  - Edit

# Rutas solo del label

- Dashboard: dashboard del label
- Profile: Perfil del label
- Releases: CRUD de releases
  - List
  - New
  - Details
  - Edit
  - Promos: CRUD de promos
    - List(release-id)
    - New(release-id): Crea una promo en una release específica
    - Details(promo-id)
    - Edit(promo-id)
- AudienceLists
  - List
  - New
  - Details
  - Edit
  - Feedback / Analytics
  - BulkUpload
  - alta de destinatario en lista

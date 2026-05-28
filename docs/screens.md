# Común para todos los roles

- Auth: Autenticación en general
  - Login: Inicio de sesión
  - Signup: Registro
  - PasswordReset: Recuperación de contraseña

# Pantallas solo del artista

- Promos: Es posible que este grupo de pantallas pueda accederse sin estar autenticado. Requiere clarificación
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
  - BulkUpload
  - alta de destinatario en lista

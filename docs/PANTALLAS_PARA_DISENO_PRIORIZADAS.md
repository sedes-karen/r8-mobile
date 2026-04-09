# Pantallas para Diseño — Backlog priorizado

Documento para célula de diseño (UX/UI). Ordenado por prioridad de impacto en el desarrollo técnico.

Objetivo: entregar primero los diseños que desbloquean más pantallas y equipos.

Las pantallas listadas corresponden a los flujos del front de referencia **r8-site**; el alcance técnico de datos y navegación debe mantenerse alineado con [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md) y con los cuerpos HTTP en [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md).

---

## Prioridad P0 (inmediata)

1. Splash / bootstrap
2. Login
3. Registro
4. Recuperación de contraseña
5. Promos Player (inbox + reproductor)
6. Perfil artista (modo player)

Razón: desbloquea inicio de app, autenticación y prioridad funcional de artista.

---

## Prioridad P1 (alta)

1. Perfil (label) — lectura
2. Dashboard (label)
3. Analytics (label)
4. Liked Tracks (favoritos del player)
5. Formulario de feedback del destinatario (pantalla asociada a una promo, p. ej. ruta web `/promo/:id/feedback`)

Razón: cubre visualización de valor para ambos roles y pantallas de uso frecuente.

---

## Prioridad P2 (media)

1. Lista de releases
2. Detalle release
3. Lista de promos (label)
4. Detalle promo
5. Feedback (label)
6. Destinatarios (Recipients)
7. Listas de audiencia (índice)
8. Detalle lista de audiencia

Razón: módulos de operación diaria para labels; mayoría de lectura y navegación.

---

## Prioridad P3 (posterior)

1. Crear release
2. Editar release
3. Crear promo
4. Editar promo
5. Editar lista de audiencia
6. Perfil (label) — edición avanzada (imagen, password, etc.)

Razón: son pantallas con mayor carga de formularios, validaciones y estados de mutación.

---

## Entregables de diseño por pantalla

Por cada pantalla priorizada, entregar:

- Wireframe (estructura y jerarquía visual).
- UI final (estados normal, loading, vacío, error).
- Guía de componentes (atoms/molecules relevantes).
- Comportamientos clave (navegación, feedback visual, validaciones).

---

## Reglas de consistencia (Atomic Design)

- Definir primero atoms compartidos: tipografía, botones, inputs, tags, cards.
- Construir molecules reutilizables para perfiles, listas y formularios.
- Mantener patrones consistentes de:
  - headers,
  - acciones primarias/secundarias,
  - mensajes de error y confirmación.

---

## Handoff al equipo técnico

Cada entrega de diseño debe incluir:

- Nombre de pantalla y prioridad.
- Componentes reutilizables involucrados.
- Casos borde visuales.
- Nota de accesibilidad básica (contraste, tamaño táctil, jerarquía textual).

---

*Documento creado en colaboración con Cursor.*

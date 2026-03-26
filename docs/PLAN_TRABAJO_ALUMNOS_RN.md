# Plan de trabajo académico — React Native r8

Documento de organización para distribuir el desarrollo mobile entre alumnos de 3er año de Analista de Sistemas con orientación Programador.

Objetivos centrales:

- Dividir el trabajo de forma equitativa entre grupos.
- Organizar el tiempo evitando bloqueos entre equipos.
- Definir arquitectura clara basada en Atomic Design.
- Priorizar primero el perfil de Artista.
- Avanzar en Perfil de Label priorizando visualización de datos antes del CRUD completo.
- Dejar pendientes preparados para continuidad sin romper la base integrada.

---

## 1. Dotación disponible

- 35 alumnos en total:
  - 10 con perfil programador.
  - 10 que programan tareas simples.
  - 3 diseñadores (sin programación).
  - 7 QA.
  - 5 documentación funcional.

---

## 2. Organización de equipos

### 2.1 Estructura recomendada: 5 equipos de 7

Cada equipo debe ser autosuficiente para entregar valor funcional.

Composición sugerida por equipo:

- 2 programadores fuertes.
- 2 programadores simples.
- 1 QA.
- 1 documentador.
- 1 rol flexible (QA adicional, apoyo visual o soporte transversal).

### 2.2 Células transversales

Para evitar cuellos de botella y mejorar consistencia:

- 2 QA restantes: QA transversal de integración y regresión.
- 3 diseñadores: célula UX/UI transversal para lineamientos visuales, componentes base y revisión de consistencia.

---

## 3. Prioridades funcionales

Orden de prioridad para el desarrollo:

1. Perfil de Artista (completo y usable).
2. Perfil de Label en modo lectura (mostrar datos reales).
3. Perfil de Label con edición parcial.
4. Módulos restantes por dominio, en paralelo.

Principio: primero entregar lectura robusta y estable; después CRUD avanzado.

---

## 4. Roadmap por fases (sin bloqueos)

## Fase 0 (2-3 días) — Base común

Objetivo: habilitar trabajo paralelo inmediato en todos los equipos.

Entregables:

- Estructura de navegación principal (stacks por rol).
- Capa API común (`apiClient`, auth token, refresh).
- Base de diseño (tokens de color, spacing, tipografías).
- Modelos/contratos compartidos mínimos.
- Mocks funcionales por pantalla para desarrollo desacoplado.

Regla: cualquier pantalla debe poder iniciarse con mocks aunque el backend final no esté disponible.

## Fase 1 (Semana 1) — Perfil de Artista (máxima prioridad)

Entregables mínimos:

- Ver datos de perfil artista.
- Editar campos principales.
- Subida de imagen (presign + upload + confirm).
- Estados de interfaz: carga, error y vacío.
- QA funcional básico y documentación breve de uso.

Resultado esperado: módulo usable end-to-end.

## Fase 2 (Semana 2) — Perfil de Label (lectura primero)

Entregables escalonados:

- Vista de datos reales del perfil label (lectura).
- Edición parcial de campos críticos.
- Si el tiempo alcanza: imagen y cambio de contraseña.

Resultado esperado: primero visualización estable con datos reales; CRUD completo solo si no compromete estabilidad.

## Fase 3 (Semanas 3-4) — Desarrollo paralelo de dominios

Trabajo por equipos para acelerar cobertura:

- Equipo A: Auth + Splash + navegación final.
- Equipo B: Promos Player (inbox, detalle básico, estados).
- Equipo C: Dashboard + Analytics (lectura y métricas base).
- Equipo D: Releases (lista + detalle; create/edit parcial si alcanza).
- Equipo E: Recipients + Audience Lists (lectura y operaciones básicas).

---

## 5. Arquitectura propuesta (Atomic Design)

Estructura recomendada:

- `src/design/tokens/` -> variables visuales globales (colores, tipografías, spacing).
- `src/components/atoms/` -> componentes mínimos reutilizables (`Text`, `Button`, `Input`, `Avatar`, `Icon`).
- `src/components/molecules/` -> combinaciones pequeñas (`LabeledInput`, `ProfileField`, `StatCard`).
- `src/components/organisms/` -> secciones complejas (`ArtistProfileForm`, `LabelProfileHeader`).
- `src/screens/` -> pantallas finales por dominio.
- `src/features/<dominio>/` -> lógica del dominio, hooks y mapeos.
- `src/services/api/` -> cliente HTTP y endpoints.
- `src/navigation/` -> stack/tab navigators y guards por rol.

Reglas de arquitectura:

- Los atoms/molecules no llaman API.
- La lógica de datos vive en `features` y `services`.
- Las pantallas orquestan flujo y estado.
- Priorizar reutilización sobre duplicación de componentes.

---

## 6. Estrategia para evitar bloqueos

- Congelar contratos API por sprint.
- Usar mocks y feature flags cuando falten endpoints.
- Reunión diaria de integración técnica corta (15-30 min).
- Rama por feature y rama de integración semanal.
- Checklist de “listo para integrar” en cada PR:
  - no rompe navegación,
  - maneja loading/error,
  - incluye pruebas mínimas,
  - incluye nota de documentación.

---

## 7. Asignación por perfil de alumno

- Programadores fuertes:
  - arquitectura base,
  - integración API,
  - decisiones técnicas y code review.
- Programadores simples:
  - armado de UI,
  - formularios,
  - validaciones y estados visuales.
- Diseñadores:
  - guía visual,
  - consistencia de componentes,
  - revisión de usabilidad.
- QA:
  - casos de prueba,
  - smoke tests y regresión,
  - priorización de incidencias por severidad.
- Documentación:
  - ficha funcional por pantalla,
  - pasos de prueba,
  - pendientes y supuestos.

---

## 8. Criterios de entrega por pantalla

Definition of Ready:

- Existe wireframe/referencia.
- Hay contrato de datos (real o mock).
- Se definió navegación de entrada/salida.

Definition of Done:

- Implementación visual funcional.
- Consumo de datos real o mock sin romper flujo.
- Manejo de estados (loading, error, vacío).
- Pruebas mínimas ejecutadas.
- Mini documentación de alcance y pendientes.

---

## 9. Gestión de pendientes sin romper

Si un módulo no llega a cierre completo:

- Dejar TODOs claros con contexto técnico.
- Mantener flujo principal estable.
- No integrar funcionalidades inestables en rama principal.
- Documentar explícitamente:
  - qué quedó funcionando,
  - qué falta,
  - cómo continuar,
  - riesgos y dependencias.

Regla final: “mejor incompleto pero estable y continuable” que “completo pero frágil”.

---

## 10. Resumen ejecutivo

El plan propone 5 equipos equilibrados y trabajo por fases para:

- priorizar Perfil de Artista,
- asegurar Perfil de Label en lectura temprana,
- avanzar en paralelo sin bloqueos,
- sostener una arquitectura limpia en Atomic Design,
- y dejar cualquier pendiente listo para continuidad técnica ordenada.

---

## 11. Pantallas por equipo, expectativa y enlace

### Equipo 1 — Auth y Perfil Artista (prioridad máxima)

- Pantallas:
  - Splash / bootstrap
  - Login
  - Registro
  - Recuperación de contraseña
  - Perfil artista (lectura y edición)
- Se espera:
  - flujo de sesión completo y estable por rol,
  - perfil artista usable end-to-end (incluida imagen).
- Documento: [EQUIPO_1_FUNCIONAL.md](./EQUIPO_1_FUNCIONAL.md)

### Equipo 2 — Label lectura primero + métricas

- Pantallas:
  - Dashboard (label)
  - Perfil (label) lectura
  - Analytics (label) lectura
  - Perfil (label) edición parcial y avanzada
- Se espera:
  - priorizar visualización de datos reales del label antes del CRUD completo,
  - cerrar edición por capas sin romper lectura.
- Documento: [EQUIPO_2_FUNCIONAL.md](./EQUIPO_2_FUNCIONAL.md)

### Equipo 3 — Experiencia Player y favoritos

- Pantallas:
  - Promos Player (inbox + detalle)
  - Liked Tracks
  - Feedback simple legacy
  - Feedback/dismiss desde player
- Se espera:
  - experiencia de consumo/reproducción estable,
  - captura de feedback con y sin token.
- Documento: [EQUIPO_3_FUNCIONAL.md](./EQUIPO_3_FUNCIONAL.md)

### Equipo 4 — Releases y Promos (operación label)

- Pantallas:
  - Lista y detalle de releases
  - Lista y detalle de promos
  - Crear/editar release
  - Crear/editar promo
- Se espera:
  - cerrar primero lectura de catálogo y detalle,
  - luego formularios de alta/edición con validaciones y uploads.
- Documento: [EQUIPO_4_FUNCIONAL.md](./EQUIPO_4_FUNCIONAL.md)

### Equipo 5 — Recipients, Audience Lists y Feedback label

- Pantallas:
  - Destinatarios (lectura y edición)
  - Listas de audiencia (índice, detalle, edición)
  - Feedback (label)
- Se espera:
  - módulo sólido de gestión de destinatarios/listas,
  - métricas y listado de feedback para operación diaria.
- Documento: [EQUIPO_5_FUNCIONAL.md](./EQUIPO_5_FUNCIONAL.md)

### Equipo de Diseño — prioridad visual por desbloqueo

- Pantallas: backlog completo priorizado `P0 -> P3`.
- Se espera:
  - entregar primero Auth + Player + Perfil Artista,
  - luego Label lectura y resto de dominios con consistencia Atomic Design.
- Documento: [PANTALLAS_PARA_DISENO_PRIORIZADAS.md](./PANTALLAS_PARA_DISENO_PRIORIZADAS.md)

<!-- Documento creado en colaboración con Cursor -->

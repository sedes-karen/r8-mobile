# Uso de agentes LLM/IA

> Esto se pide para que el proyecto dure más de una semana sin ser un dolor de cabeza.

No objetamos al uso de herramientas de codificación con IA ni similares. Es aceptable su uso **siempre y cuando** hayas leído y entendido los cambios. Cada grupo y alumno es responsable de los cambios que sube y debe estar suficientemente preparado como para explicar los cambios realizados, además de para corregirlos si hace falta.

Estas herramientas tienen la capacidad de explicar cada parte por si mismas, por lo que es fácil cumplir con esto incluso sin haber revisado todo el código (que igual se recomienda). Nótese que copiar y pegar las explicaciones que arman los agentes es insuficiente; se pide una comprensión real de los cambios y sus consecuencias. Es posible que no se entienda algo al principio: El siguiente paso debe ser hacer tantas preguntas como sea necesario.

Se debe incluir `AGENTS.md` como contexto desde el primer mensaje. Esto lo hace automáticamente cualquier _harness_ como Claude Code, OpenCode, Codex, Antigravity, etc. Este archivo es muy importante porque contiene instrucciones específicas para agentes. Se debe incluir este archivo (`CONTRIBUTING.md`) si se quiere hacer un cambio en el código, ya que contiene las convenciones del proyecto.

Se debe verificar que se cumpla todo lo que dice este documento, tanto de forma automática (consultando el agente a que lo haga, pidiéndole una _review_) como de forma manual.

# Archivos críticos

> Esto se pide para que el proyecto dure más de una semana sin ser un dolor de cabeza.

Antes de tocar uno de los siguientes archivos, es necesario avisar al Team Leader del grupo en el que se encuentran para que le informe al resto de los TLs y entre ellos decidan si el cambio debe hacerse y por qué (efectivamente coordinando el cambio con el resto del curso).

Salvo que el Pull Request completo haya sido coordinado con el resto del curso, cada cambio a estos archivos críticos **debe estar en un PR aparte**.

- `package.json`, `package-lock.json` y `app.json` (todos se pueden editar en el mismo PR de ser necesario; conviene usar `npm ci` en lugar de `npm install` para instalar dependencias)
- `*.config.{js,ts,jsx,tsx}` (cualquier configuración general del proyecto)
- `AGENTS.md`, `CLAUDE.md` y/o `CONTRIBUTING.md`.
- `tsconfig.json`
- Cualquier archivo en `docs/` cuyo nombre esté en mayúsculas o MACRO_CASE
- `src/navigation/*` (en este caso no hace falta que esté en un PR aparte, pero si que haya un acuerdo)
- `src/constants/*` (se pueden modificar varios archivos de esta carpeta en el mismo PR)
- `src/components/atoms/*`

# Componentes

> Esto se pide para reducir el tiempo de revisión.

Los átomos y moléculas deben ser tan generales y flexibles como sea necesario para el resto del proyecto. A veces conviene listar los componentes necesarios _antes_ de realizarlos, a fin de obtener un mejor panorama sobre lo que se necesita.

Los estilos de un componente deben estar en el mismo archivo que el resto del mismo. Si alguna de las partes se vuelve muy grande, *quizás* sea momento de separar el componente en otros más pequeños.

Los átomos y moléculas **no deben** utilizar ningún servicio. Tienen el propósito expreso de poderse reutilizar tanto como sea necesario, cosa que su interfaz debe reflejar. Los organismos que estén atados a una pantalla particular (generalmente provenientes de un refactoreo) pueden utilizar servicios. Las pantallas pueden hacer uso de servicios tanto como sea conveniente (ese es el punto).

**Bajo ninguna circunstancia** puede un componente (cualquiera sea su naturaleza) "saltarse" los servicios proveídos para llamar a la API o similar. Este tipo de efectos secundarios se considera crítico y debe aislarse lo más posible (utilizando servicios, con validación de datos completa). Nótese que el uso de `console.log`/`console.table`/`console.error` para depuración está permitido, siempre y cuando esto no llegue a la versión final (siendo removido en el mismo PR).

# Antes de abrir un Pull Request / Solicitud de Cambio

> Esto se pide para reducir iteraciones en revisión y evitar merges que rompan la app.

Antes de abrir un PR, revisar que:

- La app no tenga errores de TypeScript. El editor de cada uno suele mostrar estos errores. Alternativamente, se puede ejecutar `npx tsc --noEmit` desde la raíz del proyecto.
- Se gestionen correctamente los errores generados por el uso de servicios como la API.
- No haya valores de colores, espaciados o tipografías hardcodeados que deberían usar tokens de `src/constants/design.ts`.
- No hay `console.log` ni comentarios de depuración olvidados. Se recomienda que los comentarios de depuración inicien con `DEBUG:` para facilitar su búsqueda (`TODO:` es útil para "me falta hacer esta parte").
- No se importan librerías o APIs que no están en `package.json`. Si se necesita una nueva dependencia, siga el proceso de archivos críticos (consultando a tanta gente como sea necesario).
- Se sigue el resto de esta guía de contribuidores, y se tuvo en cuenta lo que dice en el archivo `AGENTS.md` en caso de utilizar IA.

# Git

> Esto se pide para simplificar el trabajo de revisión, testing, comentado, rechazo y aprobación de cambios.

En lo posible, intenten evitar las ramas que salen de otras ramas y luego se tratan de mergear a `main`. En su lugar, un grupo de PRs independientes por funcionalidad suelen ser más fáciles de revisar, probar y editar ([ejemplos en TypeScript](https://github.com/microsoft/typescript-go/pulls?q=is%3Apr+is%3Amerged)). Son libres de crear cuantos PRs y ramas requieran.

Son libres de usar cualquier mensaje de commit que prefieran en sus PRs, pero los mensajes de fusión (al mergear la PR) deberían describir el cambio en 50-70 caracteres. **No se debe usar el mensaje de fusión por defecto**, pero se puede usar el título de la PR.

Dentro de una PR, se debe hacer un commit por cambio menor realizado. No importa si hubo que cambiar sólo una línea para arreglar un bug, igual entra en un commit. Como referencia, un commit puede abarcar entre 1 y 200 líneas de código cambiadas (dependiendo de lo que se esté haciendo). Esto facilita el uso de `git revert` como un "Ctrl+Z mucho más potente".

# Estilo del código

> Esto se pide para facilitar la comprensión y el mantenimiento del código, apuntando a la claridad y legibilidad ante todo. Algunos aspectos son más o menos controversiales.

- **Idioma**: El código debe estar escrito en inglés, con sus comentarios en español.
- **Comentarios**: En su mayoría, deben ser justificativos en lugar de indicativos. Por ejemplo, "Se usa esto como solución temporal del bug https://github.com/react/react-native/issues/33532" en lugar de "Suma dos números" debajo de una función llamada "sumar" con dos argumentos de tipo `number`. Los comentarios se ignoran al ejecutar el código, y por eso son más difíciles de actualizar y verificar, además de no siempre aportar información relevante.
- **Comentarios de documentación**: Se deben utilizar comentarios *de documentación* (`/** ... */`) encima de las funciones que tengan requerimientos o asuman cosas específicas que no se pueden verificar con Typescript (ej: `/** Asume que el número es par */`); estos comentarios aparecen al autocompletar el nombre de la función en el editor (en cualquiera que soporte LSP, incluyendo VSCode).
- **Nombres de variables**: Deben ser relativamente cortos, de propósito obvio, evitando abreviar palabras y utilizando `camelCase`. Se deben respetar las convenciones de React / React Native cuando apliquen.
- **Nombres de componentes**: Los átomos deben, en lo posible, tener nombres "estándar". En las moléculas y organismos esto es menos importante.
- **"Números mágicos" y constantes**: Se deben utilizar las constantes definidas en `src/constants/*` tanto como sea posible, evitando valores 
- **Iteración y manipulación de estructuras de datos**: Si se requiere manipular datos, la forma más clara suele ser utilizando métodos de las clases apropiadas (`Array`, `Iterator`, etc), además de `for (const ... of ...) {...}`, que se prefiere por sobre `forEach(...)` debido a la tendencia del último de requerir acumuladores adicionales (que se terminan separando visualmente si se usa `forEach` encadenado a otros métodos). Se debe evitar, tanto como sea posible, el uso de `for (let i = ...; i < ...; i++) {...}`, debido a que incrementa tanto la carga cognitiva como la posibilidad de errores.

# Code review / Revisión de código

> Esto se pide para mantener buena calidad de código y la cohesión del proyecto entre equipos.

**Cuando alguien revise tu PR:**

- No lo tomes como personal. Los comentarios apuntan al código, no a la persona. Preguntá si algo no se entiende en vez de asumir mala intención.
- Respondé a cada comentario aunque sea para decir "corregido" o para preguntar si no estás de acuerdo.
- Hacé los cambios en _commits_ nuevos. No uses `git commit --amend` ni `git rebase` durante la revisión: eso reescribe el historial y hace imposible seguir qué cambió entre rondas.

**Cuando revises un PR de un compañero:**

- Buscá inconsistencias con esta guía.
- Comprobá que el código hace lo que debería, tanto leyéndolo como ejecutándolo (con sus respectivos _tests_ si los hubiere). Si algo no se entiende, pedí que lo expliquen.
- Sé específico. "Esto no funciona" no ayuda tanto como "`handleLogin` no se llama en ningún lado".

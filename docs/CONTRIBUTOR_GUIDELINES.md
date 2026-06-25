# Archivos críticos 

Antes de tocar uno de los siguientes archivos, es necesario avisar al Team Leader del grupo en el que se encuentran para que le informe al resto de los TLs y entre ellos decidan si el cambio debe hacerse y por qué (efectivamente coordinando el cambio con el resto del curso).

Salvo que el Pull Request completo haya sido coordinado con el resto del curso, cada cambio a estos archivos críticos **debe estar en un PR aparte**.

- `package.json`, `package-lock.json` y `app.json` (todos se pueden editar en el mismo PR de ser necesario)
- `*.config.{js,ts,jsx,tsx}` (cualquier configuración general del proyecto)
- `tsconfig.json`
- Cualquier archivo en `docs/` cuyo nombre esté en mayúsculas o MACRO_CASE (incluyendo este archivo)
- `src/navigation/*` (en este caso no hace falta que esté en un PR aparte, pero si que haya un acuerdo)
- `src/constants/*` (se pueden modificar varios archivos de esta carpeta en el mismo PR)
- `src/components/atoms/*`

# Componentes

Los átomos y moléculas deben ser tan generales y flexibles como sea necesario para el resto del proyecto.

# Git

En lo posible, intenten evitar las ramas que salen de otras ramas y luego se tratan de mergear a `main`. En su lugar, un grupo de PRs independientes por funcionalidad suelen ser más fáciles de revisar, probar y editar.

Son libres de usar cualquier mensaje de commit que prefieran en sus PRs, pero los mensajes de fusión (al mergear la PR) deberían describir el cambio en 50-70 caracteres. **No se debe usar el mensaje de fusión por defecto**, pero se puede usar el título de la PR.


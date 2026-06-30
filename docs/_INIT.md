# Guía de inicio — Proyecto **R8 Mobile**

Documento para el cursado de **Programación de dispositivos móviles**. El repo **`r8-mobile`** ya está creado: **Expo** + **React Native** + **TypeScript**. El **entrypoint** del curso es **`index.tsx`** en la raíz (monta `<Navigation />`); **no** usar ni recrear `App.tsx`.

## Información general

- **Objetivo:** App móvil multiplataforma (Android + iOS) con **paridad funcional** respecto al front web **r8-site** (mismos flujos y mismos endpoints HTTP contra **r8-api**).
- **Contrato API:** no usar documentación que anide recursos bajo `/labels/:labelId/...` para releases o promos; mapa de rutas en [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md). **Cuerpos JSON, query y enums por endpoint** (para quienes solo usan la API en stage): [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md). Opcionalmente el código de `r8-site` (`src/api/`) como segunda referencia.

**Términos útiles:** **JWT** = token en `Authorization: Bearer`; **DTO** = forma del JSON de entrada/salida; **stage** = entorno de pruebas de la API. Tabla extendida en [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md#glosario-breve).

**API Stage del curso:**

```text
https://api-stage.technopremieres.com
```

Variable sugerida: `EXPO_PUBLIC_API_URL=https://api-stage.technopremieres.com`. Health check: `GET /health` → **200**.

**Estado de `main` (jun 2026):** navegación por rol (React Navigation 7), ~27 pantallas placeholder en `src/screens/`, tokens en `src/constants/design.ts`. Pendiente: `apiClient`, atoms compartidos y login real. Ver [CLASE_03_PRACTICA_B.md](./_Clases_Practicas/CLASE_03_PRACTICA_B.md) para el mapa de deuda técnica y convenciones vigentes.

---

## 1. Requisitos previos y herramientas

### 1.1. Qué hace cada herramienta

| Herramienta | Rol |
|-------------|-----|
| **Node.js** | Motor de ejecución de JavaScript fuera del navegador. Permite correr herramientas de desarrollo y servidores locales. Al instalar Node.js suele incluirse **npm** y **npx**. |
| **npm** | Gestor de paquetes del ecosistema Node: instala dependencias en `node_modules`, las declara en `package.json` / `package-lock.json`, y ejecuta **scripts** definidos en el proyecto (`npm run …`, `npm start`, etc.). |
| **npx** | Ejecutor de paquetes: corre el programa principal (*binary*) de un paquete sin obligarte a instalarlo de forma global en el sistema, o usa la copia ya instalada en el proyecto. Ver comparación con npm más abajo. |
| **Git** | Control de versiones: clonar, ramas, historial de cambios. |
| **Watchman** (macOS, opcional) | Servicio de vigilancia de archivos; puede mejorar el rendimiento del *bundler* en desarrollo. |
| **Xcode** (macOS) | SDK y simulador **iOS** para probar la app en Apple. |
| **Android Studio** | SDK, herramientas de línea de comandos y **emulador Android**. |

### 1.2. npm y npx: comparación y cuándo usar cada uno

- **npm** se orienta a **gestionar el proyecto**: instalar o actualizar librerías (`npm install`), fijar versiones con el *lockfile*, y lanzar tareas conocidas del `package.json` (`npm run android`). Lo que ejecutas con `npm run` son scripts **ya definidos** en tu repo.

- **npx** se orienta a **ejecutar un paquete como herramienta de línea de comandos**, en dos situaciones habituales:
  1. **Sin instalación global:** quieres usar una CLI una vez (p. ej. generar un proyecto) sin ensuciar el sistema con versiones globales que luego chocan entre sí.
  2. **Versión alineada al proyecto:** en un repo existente, `npx expo …` o `npx <paquete>` suele resolver el ejecutable desde `node_modules`, así usas la **misma versión** que declara el proyecto, no la que tengas instalada globalmente.

**Por qué en muchos tutoriales de React Native / Expo se usa `npx`:** los generadores (`create-expo-app`) y las CLIs (`expo`) se invocan con `npx` para obtener siempre una versión reciente o la del proyecto, sin depender de un `npm install -g` que puede quedar desactualizado o en conflicto con otra versión en otro curso o equipo.

### 1.3. Cómo instalar lo necesario para crear un proyecto React Native (Expo)

1. **Node.js (LTS)** — [nodejs.org](https://nodejs.org/) (instalador oficial) o un gestor de versiones (**nvm**, **fnm**, **Volta**) para poder cambiar de versión LTS según el `package.json` del curso.
2. Tras instalar Node, **npm** y **npx** suelen estar disponibles en la terminal sin pasos extra.
3. **Git** — [git-scm.com](https://git-scm.com/) o el paquete del sistema operativo.
4. **macOS:** **Xcode** (App Store) para simulador iOS; opcional **Watchman**: `brew install watchman`.
5. **Android:** **Android Studio** (SDK + emulador o dispositivo con depuración USB).

Comprobar que la terminal ve las herramientas:

```bash
node -v
npm -v
npx -v
git --version
```

### 1.4. Crear un proyecto nuevo con Expo (`create-expo-app`)

Desde la carpeta donde quieras el proyecto (sustituir `mi-app` por el nombre del directorio):

```bash
npx create-expo-app@latest mi-app
```

El asistente puede ser interactivo. Para elegir plantilla por línea de comandos, por ejemplo **TypeScript** en blanco:

```bash
npx create-expo-app@latest mi-app --template blank-typescript
```

Otras plantillas habituales del CLI: `default`, `blank`, `tabs`, `bare-minimum`. Para ver la lista actual: `npx create-expo-app@latest --help`. Con `-y` / `--yes` se aceptan opciones por defecto sin preguntas.

Luego:

```bash
cd mi-app
npm install   # si el generador no dejó todo instalado
npm start
```

**Nota:** el repo **`r8-mobile`** de la materia ya está creado; esta sección sirve para alumnos que practiquen un *scaffold* desde cero o otro proyecto paralelo.

---

## 2. Instalación y ejecución

Desde la raíz del repo `r8-mobile`:

```bash
npm ci
```

(si no hay lockfile alineado en tu entorno, `npm install`).

Ejecutar:

```bash
npm start
```

Opciones habituales:

- **Dispositivo físico:** app **Expo Go** + escanear QR.
- **Android:** `npm run android`
- **iOS (macOS):** `npm run ios`
- **Web (opcional):** `npm run web` (requiere `react-dom` y `react-native-web`, ya en el proyecto tras `npm install`; si Expo avisa que faltan: `npx expo install react-dom react-native-web`).

Limpieza de caché si hace falta:

```bash
npx expo start --clear
```

---

## 3. Estructura del código (estado en `main`)

El plan de la cátedra organiza el repo así (ver [PLAN_TRABAJO_ALUMNOS_RN.md](./PLAN_TRABAJO_ALUMNOS_RN.md)):

| Ruta | Estado en `main` | Rol |
|------|------------------|-----|
| `index.tsx` (raíz) | Hecho | Entrypoint; monta navegación |
| `src/navigation/` | Hecho | Stacks Auth / Artist / Label (React Navigation 7) |
| `src/screens/{Auth,Artist,Label}/` | Placeholders | Pantallas por flujo |
| `src/constants/design.ts` | Ejemplo | **Tokens únicos del curso** (no `src/design/tokens/`) |
| `src/features/` | Auth stub | Hooks y contexto de dominio |
| `src/components/{atoms,molecules,organisms}/` | Vacío (`.keep`) | UI compartida — próximo hito transversal |
| `src/services/api/` | Vacío | `apiClient` + servicios HTTP |
| `src/types/` | Vacío | DTOs TypeScript alineados a [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md) |

**Navegación:** stacks anidados por rol (sin bottom tabs por ahora). Decisión documentada en [screens.md](./screens.md#navegación-decisión-del-curso-jun-2026).

---

## 4. Conceptos a cubrir en el cursado

- Componentes, JSX, estado (`useState`, etc.)
- Estilos (`StyleSheet` o el sistema que adopte el equipo)
- Navegación (p. ej. React Navigation)
- Consumo de **r8-api** con el mismo contrato que **r8-site** (Bearer + refresh; ver referencia API)
- Manejo de errores y estados vacíos/carga

---

## 5. Documentación relacionada

- Plan por equipos y fases: [PLAN_TRABAJO_ALUMNOS_RN.md](./PLAN_TRABAJO_ALUMNOS_RN.md)
- Endpoints y alineación con el web: [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md)
- DTOs y cuerpos por petición (stage): [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md)
- Atomic Design y capas UI: [ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md)
- Mapa de pantallas: [screens.md](./screens.md)
- Alineación post-revisión API: [CLASE_03_PRACTICA_B.md](./_Clases_Practicas/CLASE_03_PRACTICA_B.md)
- Prácticas de clase: `docs/_Clases_Practicas/CLASE_02_PRACTICA.md`, `CLASE_02_PRACTICA_B.md`, `CLASE_03_PRACTICA.md`
- Especificaciones por equipo: `EQUIPO_1_FUNCIONAL.md` … `EQUIPO_5_FUNCIONAL.md`
- Backlog de diseño: [PANTALLAS_PARA_DISENO_PRIORIZADAS.md](./PANTALLAS_PARA_DISENO_PRIORIZADAS.md)

---

## 6. Notas

- iOS requiere macOS para simulador local (salvo build en la nube).
- **Auth en mobile:** estrategia por fases documentada en [REFERENCIA_API_R8.md § Autenticación en React Native](./REFERENCIA_API_R8.md#autenticación-en-react-native-decisión-del-curso). Sprint de login: `accessToken` en SecureStore + `Authorization: Bearer`; refresh con cookie en sprint siguiente.
- Quien no tenga el repo **r8-api** debe basarse en [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md) y en pruebas contra stage.

---

*Documento creado en colaboración con Cursor.*

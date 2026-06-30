# R8 Mobile (React Native + Expo)

Proyecto base para desarrollar la app móvil del sistema **R8** en React Native con **Expo** (multiplataforma: Android e iOS).

## Estado actual del proyecto

El repo **ya no es el template mínimo de Expo**. En `main` (jun 2026):

- **Entrypoint:** `index.tsx` en la raíz → monta `<Navigation />` (no existe `App.tsx`).
- **Navegación:** React Navigation 7 (Static API) con stacks por rol: Auth, Artist y Label.
- **Pantallas:** ~27 placeholders en `src/screens/{Auth,Artist,Label}/`.
- **Tokens de diseño:** `src/constants/design.ts` (convención única del curso).
- **Pendiente en `main`:** atoms/molecules compartidos, `src/services/api/` (apiClient) y auth real (hoy `AuthInfoProvider` siempre `isAuthenticated: false`).

### API Stage del curso

```text
https://api-stage.technopremieres.com
```

Comprobar: `GET /health` → **200**. Variable sugerida al conectar HTTP real:

```bash
EXPO_PUBLIC_API_URL=https://api-stage.technopremieres.com
```

### Alineación con el ecosistema R8

- **Objetivo funcional:** la app móvil debe cubrir los mismos flujos que el front **r8-site** (React), consumiendo la misma API **r8-api** (Express).
- **Contrato HTTP:** la API organiza rutas por **dominio** (`/releases`, `/promos`, `/recipient-lists`, `/feedback`, …) y el contexto de label/usuario lo resuelve el **JWT**, no rutas anidadas del estilo `/labels/:labelId/releases`.
- **Fuente de verdad HTTP:** `docs/REFERENCIA_API_R8.md` y `docs/DTOs_Y_CUERPOS_HTTP.md` (jun 2026, v2026-06-30). Ante duda, ganan esos dos archivos y el cliente web `r8-site/src/api/`.

## Requisitos previos

### Node.js y Git

Verificar:

```bash
node -v
npm -v
git --version
```

### macOS (recomendado para iOS)

- Xcode (para simulador y/o builds).
- (Opcional) Watchman:

```bash
brew install watchman
```

### Android (simulador)

- Android Studio + un emulador creado.

## Inicializar / instalar dependencias

Desde el root del proyecto `r8-mobile`:

Si todavía no tenés el repo en tu máquina (ejemplo):

```bash
git clone <URL_DEL_REPOSITORIO> r8-mobile
cd r8-mobile
```

```bash
cd r8-mobile
npm ci
```

Si no querés usar `npm ci` (o no existe `package-lock.json`), podés usar:

```bash
npm install
```

## Ejecutar la app

El proyecto usa Expo. Tenés varias formas típicas de correrla.

### Opción A: Dispositivo físico (Expo Go) (recomendado)

1. Instalar **Expo Go** en tu celular (App Store / Play Store).
2. En una terminal, ejecutar:

```bash
npm start
```

3. Abrir la URL/QR que muestra Expo.
4. Escanear el **QR** con Expo Go.

Funciona tanto para Android como para iOS.

### Opción B: Emulador Android

1. Abrir Android Studio.
2. Iniciar un emulador.
3. Ejecutar:

```bash
npm run android
```

### Opción C: Simulador iOS (solo macOS)

1. Abrir Xcode.
2. Iniciar un simulador (iPhone, iPad).
3. Ejecutar:

```bash
npm run ios
```

### Opción D: Navegador (web)

Sirve para pruebas rápidas de UI. Las dependencias **`react-dom`** y **`react-native-web`** están declaradas en el proyecto (instalación: `npm install`). Si en un entorno viejo falta alguna y Expo lo indica al correr web:

```bash
npx expo install react-dom react-native-web
```

Luego:

```bash
npm run web
```

## Scripts disponibles

Los scripts vienen en `package.json`:

```bash
npm start
npm run android
npm run ios
npm run web
```

## Limpieza de caché (si algo queda raro)

Cuando haya problemas con cambios o assets, podés forzar limpieza:

```bash
npx expo start --clear
```

## Documentación de la cátedra

### Plan, arquitectura y pantallas

- `docs/PLAN_TRABAJO_ALUMNOS_RN.md` — fases, equipos y estrategia anti-bloqueos
- `docs/ATOMIC_DESIGN.md` — capas UI (atoms → screens)
- `docs/screens.md` — mapa de pantallas y decisiones de navegación
- `docs/_INIT.md` — guía de inicio (herramientas, estructura, stage)

### Contrato HTTP (obligatorio antes de codear servicios)

- `docs/REFERENCIA_API_R8.md` — rutas, flujos y glosario (v2026-06-30)
- `docs/DTOs_Y_CUERPOS_HTTP.md` — cuerpos JSON, enums y ejemplos (v2026-06-30)

### Prácticas de clase

- `docs/_Clases_Practicas/CLASE_02_PRACTICA.md` — hooks y ciclo de vida
- `docs/_Clases_Practicas/CLASE_02_PRACTICA_B.md` — carpetas, atoms, pantallas estáticas
- `docs/_Clases_Practicas/CLASE_03_PRACTICA.md` — organisms, mocks, capa de datos
- `docs/_Clases_Practicas/CLASE_03_PRACTICA_B.md` — alineación post-revisión API, deuda técnica y convenciones
- `docs/_Clases_Practicas/CLASE_04_PRACTICA.md` — apiClient, login stage, primer HTTP real

### Documentos funcionales por equipo

- `docs/EQUIPO_1_FUNCIONAL.md` — Auth, splash, perfil artista
- `docs/EQUIPO_2_FUNCIONAL.md` — Dashboard, perfil label, analytics
- `docs/EQUIPO_3_FUNCIONAL.md` — Player, inbox, feedback receptor
- `docs/EQUIPO_4_FUNCIONAL.md` — Releases y promos (label)
- `docs/EQUIPO_5_FUNCIONAL.md` — Recipient lists, bulk batch, feedback label

### Diseño

- `docs/PANTALLAS_PARA_DISENO_PRIORIZADAS.md` — backlog para diseño

---

*Documento creado en colaboración con Cursor.*

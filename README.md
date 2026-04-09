# R8 Mobile (React Native + Expo)

Proyecto base para desarrollar la app móvil del sistema **R8** en React Native con **Expo** (multiplataforma: Android e iOS).

## Estado actual del proyecto

El proyecto viene con un **template inicial** en **TypeScript** (archivo principal `App.tsx`). Al ejecutar la app verás un texto de bienvenida y `StatusBar`.

### Alineación con el ecosistema R8

- **Objetivo funcional:** la app móvil debe cubrir los mismos flujos que el front **r8-site** (React), consumiendo la misma API **r8-api** (Express).
- **Contrato HTTP:** la API organiza rutas por **dominio** (`/releases`, `/promos`, `/recipient-lists`, `/feedback`, …) y el contexto de label/usuario lo resuelve el **JWT**, no rutas anidadas del estilo `/labels/:labelId/releases`. La referencia para el curso está en `docs/REFERENCIA_API_R8.md`.

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

Plan de trabajo y distribución por equipos:

- `docs/PLAN_TRABAJO_ALUMNOS_RN.md`

Referencia HTTP (paridad con r8-site / r8-api):

- `docs/REFERENCIA_API_R8.md`

DTOs y cuerpos de cada petición (para consumo en stage sin código de API):

- `docs/DTOs_Y_CUERPOS_HTTP.md`

Guía de inicio (incluye explicaciones generales):

- `docs/_INIT.md`

Documentos funcionales por equipo:

- `docs/EQUIPO_1_FUNCIONAL.md`
- `docs/EQUIPO_2_FUNCIONAL.md`
- `docs/EQUIPO_3_FUNCIONAL.md`
- `docs/EQUIPO_4_FUNCIONAL.md`
- `docs/EQUIPO_5_FUNCIONAL.md`

Backlog para diseño:

- `docs/PANTALLAS_PARA_DISENO_PRIORIZADAS.md`

Índice conceptual de API (rutas + glosario): `docs/REFERENCIA_API_R8.md`. Cuerpos de petición: `docs/DTOs_Y_CUERPOS_HTTP.md`.

---

*Documento creado en colaboración con Cursor.*

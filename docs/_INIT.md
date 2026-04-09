# Guía de inicio — Proyecto **R8 Mobile**

Documento para el cursado de **Programación de dispositivos móviles**. El repo **`r8-mobile`** ya está creado: **Expo** + **React Native** + **TypeScript** (archivo de entrada `App.tsx`).

## Información general

- **Objetivo:** App móvil multiplataforma (Android + iOS) con **paridad funcional** respecto al front web **r8-site** (mismos flujos y mismos endpoints HTTP contra **r8-api**).
- **Contrato API:** no usar documentación que anide recursos bajo `/labels/:labelId/...` para releases o promos; mapa de rutas en [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md). **Cuerpos JSON, query y enums por endpoint** (para quienes solo usan la API en stage): [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md). Opcionalmente el código de `r8-site` (`src/api/`) como segunda referencia.

**Términos útiles:** **JWT** = token en `Authorization: Bearer`; **DTO** = forma del JSON de entrada/salida; **stage** = entorno de pruebas de la API. Tabla extendida en [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md#glosario-breve).

---

## 1. Requisitos previos

- **Node.js** (LTS recomendada; compatible con la versión del `package.json` del proyecto).
- **Git**
- **macOS:** Xcode para simulador iOS; opcional **Watchman** (`brew install watchman`).
- **Android:** Android Studio + emulador.

Verificar:

```bash
node -v
npm -v
git --version
```

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
- **Web (opcional):** `npm run web`

Limpieza de caché si hace falta:

```bash
npx expo start --clear
```

---

## 3. Estructura esperada del código (evolución del proyecto)

El template inicial es mínimo. El plan de la cátedra propone organizar así (ver [PLAN_TRABAJO_ALUMNOS_RN.md](./PLAN_TRABAJO_ALUMNOS_RN.md)):

- `src/components/` — Atomic Design (atoms / molecules / organisms)
- `src/screens/` — pantallas por flujo
- `src/services/api/` — cliente HTTP y llamadas al backend
- `src/types/` o tipos junto al servicio — formas de datos (**DTOs** / interfaces TypeScript) alineadas a [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md)
- `src/navigation/` — stacks y guards por rol
- `src/features/<dominio>/` — hooks y lógica de dominio

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
- Especificaciones por equipo: `EQUIPO_1_FUNCIONAL.md` … `EQUIPO_5_FUNCIONAL.md`
- Backlog de diseño: [PANTALLAS_PARA_DISENO_PRIORIZADAS.md](./PANTALLAS_PARA_DISENO_PRIORIZADAS.md)

---

## 6. Notas

- iOS requiere macOS para simulador local (salvo build en la nube).
- La integración con cookies de refresh en móvil debe definirse con cuidado (cliente HTTP / almacenamiento). Quien no tenga el repo **r8-api** debe basarse en [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md) y en pruebas contra stage.

---

*Documento creado en colaboración con Cursor.*

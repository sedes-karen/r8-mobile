// Tokens de diseño — espejo del tema oscuro de r8-site (tailwind.config.js).
// Fuente de verdad: r8-site/tailwind.config.js. Si cambia allá, sincronizar acá a mano
// (no compartimos build system entre mobile y web).

export const colors = {
  background: '#000000',
  surface: {
    default: '#131313',
    dim: '#131313',
    bright: '#393939',
    containerLowest: '#0e0e0e',
    containerLow: '#1c1b1b',
    container: '#201f1f',
    containerHigh: '#2a2a2a',
    containerHighest: '#353534',
    variant: '#353534',
    border: '#1a1a1a',
  },
  onSurface: {
    default: '#e5e2e1',
    variant: '#c4c7c8',
  },
  primary: {
    default: '#ffffff',
    foreground: '#2f3131',
    container: '#e2e2e2',
  },
  secondary: {
    default: '#c7c6c6',
    container: '#464747',
  },
  error: {
    default: '#ffb4ab',
    container: '#93000a',
    onContainer: '#ffdad6',
  },
  gray: {
    50: '#f9fafb',
    100: '#e5e2e1',
    200: '#c4c7c8',
    300: '#8e9192',
    400: '#8e9192',
    500: '#6b7280',
    600: '#444748',
    700: '#353534',
    800: '#2a2a2a',
    900: '#131313',
    950: '#0e0e0e',
  },
  white: '#ffffff',
} as const;

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// Escala de tipografía — espejo de tailwind.config.js `fontSize`.
// lineHeight y letterSpacing vienen convertidos a px (RN no acepta unitless ni `em`).
export const typography = {
  fontFamily: {
    // IBM Plex Mono cargada vía @expo-google-fonts/ibm-plex-mono (ver src/hooks/useAppFonts.ts).
    // Fallback a monospace del sistema mientras carga o si falla la carga.
    regular: 'IBMPlexMono_400Regular',
    medium: 'IBMPlexMono_500Medium',
    semibold: 'IBMPlexMono_600SemiBold',
    fallback: 'monospace',
  },
  variants: {
    'display-lg': { fontSize: 48, lineHeight: 53, letterSpacing: -1.92, fontWeight: '600' },
    'headline-lg': { fontSize: 32, lineHeight: 38, letterSpacing: -0.64, fontWeight: '500' },
    'title-md': { fontSize: 18, lineHeight: 25, letterSpacing: 0, fontWeight: '500' },
    'body-lg': { fontSize: 16, lineHeight: 26, letterSpacing: 0, fontWeight: '400' },
    'body-sm': { fontSize: 14, lineHeight: 21, letterSpacing: 0, fontWeight: '400' },
    'label-caps': { fontSize: 12, lineHeight: 12, letterSpacing: 1.2, fontWeight: '600' },
    'label-micro': { fontSize: 10, lineHeight: 10, letterSpacing: 2, fontWeight: '500' },
  },
} as const;

export type TypographyVariant = keyof typeof typography.variants;

// Casi todo en 0 en r8-site salvo los pills — se replica igual acá.
export const borderRadius = {
  none: 0,
  sm: 0,
  md: 0,
  lg: 0,
  xl: 0,
  '2xl': 0,
  full: 9999,
} as const;

// RN no tiene box-shadow con blur/spread declarativo simple: se usa elevación (Android) +
// shadow* (iOS) por nivel. Estos valores son un punto de partida, no vienen 1:1 de tailwind
// (que en web resuelve elevación con color de superficie, no con shadow).
export const elevations = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
} as const;

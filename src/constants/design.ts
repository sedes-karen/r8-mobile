// Archivo de ejemplo con constantes de diseño para que se entienda que va acá
// LA IDEA ES CAMBIARLO

// Los nombres son similares a los que se usan en la práctica
// ESTOS SI O SI SE CAMBIAN
export const colors = {
  primary: '#2563EB',    // blue-600
  primaryDark: '#1E40AF', // blue-800
  onPrimary: '#FFFFFF',
  secondary: '#9333EA',   // purple-600
  secondaryDark: '#6B21A5', // purple-800
  onSecondary: '#FFFFFF',
  neutral: '#6B7280',     // gray-500
  neutralLight: '#F3F4F6', // gray-100
  neutralDark: '#374151', // gray-700
  error: '#EF4444',       // red-500
  success: '#10b981',
  onError: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F9FAFB',     // gray-50
  text: '#111827',        // gray-900
  textMuted: '#6B7280',   // gray-500
} as const;

// Estos capaz ni hace falta cambiarlos
export const spacing = {
  // Semantic spacing (based on 4dp grid)
  px: 1,
  none: 0,
  xs: 4,    // 4dp
  sm: 8,    // 8dp
  md: 16,   // 16dp
  lg: 24,   // 24dp
  xl: 32,   // 32dp
  '2xl': 40,
  '3xl': 48,
  // Mientras menos se usen las de abajo, mejor. Conviene cambiarlas por las de arriba
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

// Es posible que este no se use así, sino como parte de un componente card
// Este componente card simularía elevaciones positivas y negativas usando colores y sombras
export const elevations = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
} as const;

# Programación de dispositivos móviles

## Práctica B — Estructura del proyecto, primeras pantallas y controles sin datos

**Prerrequisito:** haber leído o trabajado [CLASE_02_PRACTICA.md](./CLASE_02_PRACTICA.md) (componentes, `useState`, `useEffect`, idea de navegación).

**Objetivo de esta práctica:** pasar del `App.tsx` mínimo a una **base de carpetas** alineada al plan del curso ([PLAN_TRABAJO_ALUMNOS_RN.md](../PLAN_TRABAJO_ALUMNOS_RN.md) y [ATOMIC_DESIGN.md](../ATOMIC_DESIGN.md)), con **una pantalla estática por equipo** (sin API, sin datos reales) y los **primeros controles reutilizables** (atoms y molecules).

**Qué NO hace esta práctica (a propósito):**

- No llama a **r8-api** (eso viene en otra clase).
- No implementa login real ni guards por rol.
- No exige que los 5 equipos editen el mismo archivo a la vez: cada equipo se enfoca en **su** pantalla; el doc muestra las cinco para que el proyecto común tenga un “mapa” navegable en desarrollo.

---

## Cómo leer cada paso

En todo el documento, cada paso sigue este esquema:

| Bloque | Significado |
|--------|-------------|
| **Qué** | Resultado concreto que debe quedar hecho. |
| **Cómo** | Comandos, rutas y código a crear o pegar (adaptá nombres si el profe indica otra convención). |
| **Por qué** | Decisión de diseño o de curso; evita “copiar sin entender”. |
| **Cómo funciona** | Qué hace React Native / React / la navegación por debajo. |

---

## Vista previa: árbol de carpetas al finalizar

```text
r8-mobile/
├── App.tsx                          ← solo monta la navegación
├── index.ts                         ← sin cambios (registra App)
└── src/
    ├── design/
    │   └── tokens/
    │       ├── colors.ts
    │       └── spacing.ts
    ├── components/
    │   ├── atoms/
    │   │   ├── AppText.tsx
    │   │   ├── PrimaryButton.tsx
    │   │   └── ScreenTitle.tsx
    │   └── molecules/
    │       ├── LabeledTextField.tsx
    │       ├── StatCard.tsx
    │       └── ListRowCard.tsx
    ├── screens/
    │   ├── DevMenuScreen.tsx        ← menú para saltar a cada pantalla (solo desarrollo)
    │   ├── auth/
    │   │   └── LoginScreen.tsx           ← Equipo 1
    │   ├── label/
    │   │   └── DashboardLabelScreen.tsx  ← Equipo 2
    │   ├── player/
    │   │   └── PromosInboxScreen.tsx     ← Equipo 3
    │   ├── releases/
    │   │   └── ReleasesListScreen.tsx    ← Equipo 4
    │   └── audience/
    │       └── AudienceListsScreen.tsx   ← Equipo 5
    └── navigation/
        └── RootStack.tsx
```

Las carpetas `organisms/`, `features/`, `services/api/` y `types/` **se crean vacías o en una clase posterior**; acá se explica para qué sirven pero no son obligatorias en la Práctica B.

---

## Paso 0 — Instalar navegación (dependencia nueva)

### Qué

Agregar **React Navigation** al proyecto para poder registrar pantallas y moverse entre ellas.

### Cómo

En la raíz del repo (`r8-mobile`):

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

No uses `npm install` a mano para esos paquetes: `expo install` elige versiones compatibles con tu SDK de Expo.

### Por qué

React Native **no trae** un sistema de rutas como el navegador web. Sin esta librería, cada “pantalla” sería un `if` en `App.tsx` que escala mal con 30+ pantallas del plan del curso.

### Cómo funciona

- `@react-navigation/native` define el contenedor (`NavigationContainer`) y el concepto de **pila** (stack): pantallas apiladas como cartas.
- `@react-navigation/native-stack` usa transiciones nativas en iOS/Android.
- `react-native-screens` optimiza memoria: las pantallas que no se ven pueden desmontarse o quedar en nativo.
- `react-native-safe-area-context` evita que el contenido quede debajo del notch o la barra de estado (muy común en iPhone).

---

## Paso 1 — Crear la raíz `src/` y subcarpetas vacías

### Qué

Tener el esqueleto de carpetas que usarán todos los equipos el resto del cuatrimestre.

### Cómo

Desde la raíz del proyecto, crear directorios (en terminal o desde el IDE):

```bash
mkdir -p src/design/tokens
mkdir -p src/components/atoms
mkdir -p src/components/molecules
mkdir -p src/screens/auth
mkdir -p src/screens/label
mkdir -p src/screens/player
mkdir -p src/screens/releases
mkdir -p src/screens/audience
mkdir -p src/navigation
```

Opcional (para dejar preparado el plan, sin archivos aún):

```bash
mkdir -p src/components/organisms
mkdir -p src/features
mkdir -p src/services/api
mkdir -p src/types
```

### Por qué

| Carpeta | Rol en el curso |
|---------|------------------|
| `design/tokens/` | Un solo lugar para colores y espaciados; si el diseño cambia, tocás poco código. |
| `components/atoms/` | Piezas mínimas reutilizables; **sin** lógica de negocio ni HTTP. |
| `components/molecules/` | Combinaciones chicas (input + label, fila de lista). |
| `components/organisms/` | Bloques grandes (formulario completo); en Práctica B aún no hace falta. |
| `screens/<dominio>/` | Una pantalla por flujo; **orquesta** UI y más adelante hooks/API. |
| `navigation/` | Stacks y tabs; separado para no mezclar rutas con JSX de botones. |
| `features/`, `services/api/`, `types/` | Lógica y HTTP; se llenan cuando haya contrato con stage. |

Separar por **dominio** (`auth`, `label`, `player`…) evita un único folder `screens/` con 40 archivos mezclados.

### Cómo funciona

TypeScript y Metro (el empaquetador de Expo) resuelven imports por ruta, por ejemplo:

```ts
import { LoginScreen } from './src/screens/auth/LoginScreen';
```

No hay magia: cada archivo `.tsx` exporta un componente React; las carpetas son convención del equipo y del plan académico.

---

## Paso 2 — Tokens de diseño (colores y espaciado)

### Qué

Definir constantes visuales compartidas para que todas las pantallas se vean coherentes sin copiar `#222` en diez archivos.

### Cómo

**Archivo:** `src/design/tokens/colors.ts`

```ts
export const colors = {
  background: '#FFFFFF',
  surface: '#F5F5F7',
  text: '#111111',
  textMuted: '#6B6B6B',
  primary: '#1A1A1A',
  primaryText: '#FFFFFF',
  border: '#E0E0E0',
  error: '#B00020',
  placeholder: '#9E9E9E',
} as const;
```

**Archivo:** `src/design/tokens/spacing.ts`

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
```

**Archivo opcional** `src/design/tokens/index.ts` (reexporta todo):

```ts
export { colors } from './colors';
export { spacing } from './spacing';
```

### Por qué

En [ATOMIC_DESIGN.md](../ATOMIC_DESIGN.md) se pide que los **atoms** no inventen estilos sueltos. Los tokens son la capa más baja: no son componentes, son **datos** que los componentes consumen.

### Cómo funciona

`as const` en TypeScript hace que los valores se traten como literales fijos (autocompletado y menos typos). En runtime es un objeto JavaScript normal importado donde haga falta; no hay CSS global como en la web: en RN cada componente aplica estilos con `StyleSheet` o arrays de estilo.

---

## Paso 3 — Primer atom: `AppText`

### Qué

Un wrapper de `Text` con tipografía base del proyecto (título, cuerpo, caption).

### Cómo

**Archivo:** `src/components/atoms/AppText.tsx`

```tsx
import { Text, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { colors } from '../../design/tokens/colors';

type Variant = 'title' | 'body' | 'caption';

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
};

const variantStyles: Record<Variant, TextStyle> = {
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  return (
    <Text
      style={[
        styles.base,
        variantStyles[variant],
        muted && styles.muted,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { color: colors.text },
  muted: { color: colors.textMuted },
});
```

### Por qué

`<Text>` nativo no tiene “variantes”. Centralizar tamaños evita que en Login use 18px y en Dashboard 20px sin querer.

### Cómo funciona

- `AppText` es una **función** que devuelve JSX (un componente funcional).
- `...rest` reenvía props nativas (`numberOfLines`, `onPress` si fuera `Text` anidable, etc.).
- El array `[styles.base, variantStyles[variant], …]` fusiona estilos; los de la derecha pisan a los de la izquierda en caso de conflicto.
- **No tiene estado:** es un atom puro de presentación.

---

## Paso 4 — Atoms: `PrimaryButton` y `ScreenTitle`

### Qué

Botón primario reutilizable y título de pantalla alineado al safe area.

### Cómo

**Archivo:** `src/components/atoms/PrimaryButton.tsx`

```tsx
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { color: colors.primaryText, fontWeight: '600', fontSize: 16 },
});
```

**Archivo:** `src/components/atoms/ScreenTitle.tsx`

```tsx
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { spacing } from '../../design/tokens/spacing';

type Props = { title: string; subtitle?: string };

export function ScreenTitle({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" muted style={styles.sub}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  sub: { marginTop: spacing.xs },
});
```

### Por qué

- `Pressable` es el reemplazo moderno de `TouchableOpacity` en muchos diseños: permite estilos según `pressed`.
- `ScreenTitle` unifica cabeceras de las 5 pantallas del ejercicio.

### Cómo funciona

`onPress` en `PrimaryButton` **no** navega ni llama API: solo ejecuta la función que le pasa el padre. Eso respeta la regla “atoms sin lógica de negocio”. La pantalla decidirá `onPress={() => navigation.navigate('…')}` o `Alert.alert` de prueba.

---

## Paso 5 — Molecules: campo con etiqueta, tarjeta de métrica, fila de lista

### Qué

Combinar atoms (y `TextInput` nativo) en piezas un poco más grandes, aún **sin datos de API**.

### Cómo

**Archivo:** `src/components/molecules/LabeledTextField.tsx`

```tsx
import { View, TextInput, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  /** Solo visual en Práctica B; sin validación real */
  error?: string;
};

export function LabeledTextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
}: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error ? styles.inputError : null]}
        autoCapitalize="none"
      />
      {error ? (
        <AppText variant="caption" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, marginTop: spacing.xs },
});
```

**Archivo:** `src/components/molecules/StatCard.tsx`

```tsx
import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

type Props = {
  label: string;
  /** Texto estático en Práctica B, ej. "12" o "—" */
  value: string;
};

export function StatCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="title" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    minWidth: 100,
  },
  value: { marginTop: spacing.xs },
});
```

**Archivo:** `src/components/molecules/ListRowCard.tsx`

```tsx
import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

type Props = {
  title: string;
  subtitle?: string;
};

/** Fila tipo “ítem de lista” con datos hardcodeados en la pantalla */
export function ListRowCard({ title, subtitle }: Props) {
  return (
    <View style={styles.row}>
      <AppText variant="body">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" muted>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
```

### Por qué

| Molecule | Equipo que más la usará en esta práctica |
|----------|------------------------------------------|
| `LabeledTextField` | Equipo 1 (Login) |
| `StatCard` | Equipo 2 (Dashboard) |
| `ListRowCard` | Equipos 3, 4 y 5 (listas) |

Siguen sin HTTP: reciben strings por **props**; la pantalla puede pasar textos fijos `"Promo demo"`.

### Cómo funciona

`LabeledTextField` es **controlado**: el valor vive en el padre (`useState` en la screen) y baja por `value` + `onChangeText`. React re-renderiza la screen cuando cambia el estado, y el `TextInput` muestra el texto nuevo. En Práctica B no validás contra la API; solo practicás el patrón que usarás en login real.

---

## Paso 6 — Pantalla Equipo 1: Login (sin autenticación real)

### Qué

Pantalla estática de login: campos email/contraseña y botón “Entrar” que **no** llama a `POST /auth/login`.

### Cómo

**Archivo:** `src/screens/auth/LoginScreen.tsx`

```tsx
import { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { PrimaryButton } from '../../components/atoms/PrimaryButton';
import { LabeledTextField } from '../../components/molecules/LabeledTextField';
import { spacing } from '../../design/tokens/spacing';
import { colors } from '../../design/tokens/colors';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    Alert.alert(
      'Práctica B',
      `UI lista. Email: ${email || '(vacío)'}\n(API en otra clase)`,
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <ScreenTitle
            title="Iniciar sesión"
            subtitle="Equipo 1 — Auth (sin API)"
          />
          <LabeledTextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="nombre@ejemplo.com"
          />
          <LabeledTextField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <PrimaryButton title="Entrar" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
});
```

### Por qué

Equipo 1 es prioridad del proyecto (auth + perfil artista). Empezar por Login enseña **estado local** + molecules antes de conectar JWT ([REFERENCIA_API_R8.md](../REFERENCIA_API_R8.md)).

### Cómo funciona

- `useState('')` crea estado que **persiste entre renders** del mismo componente.
- `setEmail` dispara un re-render; `LabeledTextField` recibe el `value` actualizado.
- `Alert.alert` es nativo: sirve para verificar que el botón enlaza sin montar un backend.
- `SafeAreaView` + `KeyboardAvoidingView` evitan que el teclado tape el botón en dispositivos reales.

---

## Paso 7 — Pantalla Equipo 2: Dashboard label (métricas ficticias)

### Qué

Cabecera de bienvenida y tres tarjetas con números **hardcodeados** (sin `GET /promos/for-label`).

### Cómo

**Archivo:** `src/screens/label/DashboardLabelScreen.tsx`

```tsx
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { StatCard } from '../../components/molecules/StatCard';
import { spacing } from '../../design/tokens/spacing';
import { colors } from '../../design/tokens/colors';

const PLACEHOLDER_STATS = [
  { label: 'Promos activas', value: '—' },
  { label: 'Enviadas (mes)', value: '—' },
  { label: 'Feedback pendiente', value: '—' },
] as const;

export function DashboardLabelScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenTitle
          title="Dashboard"
          subtitle="Equipo 2 — Label (datos de ejemplo)"
        />
        <View style={styles.row}>
          {PLACEHOLDER_STATS.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm },
});
```

### Por qué

El plan pide **lectura estable** del label antes del CRUD. El dashboard es la primera pantalla de valor para el sello; `StatCard` se reutilizará cuando lleguen datos reales.

### Cómo funciona

`PLACEHOLDER_STATS` es un array constante en el archivo (no viene de red). `.map()` genera un `StatCard` por ítem; `key={item.label}` ayuda a React a identificar cada hijo en listas. `flexDirection: 'row'` coloca las tarjetas en fila; en pantallas angostas el diseño se puede refinar después con `flexWrap`.

---

## Paso 8 — Pantalla Equipo 3: Inbox de promos (player)

### Qué

Lista visual de promos de **ejemplo** (títulos fijos), sin `GET /promos/inbox`.

### Cómo

**Archivo:** `src/screens/player/PromosInboxScreen.tsx`

```tsx
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { ListRowCard } from '../../components/molecules/ListRowCard';
import { spacing } from '../../design/tokens/spacing';
import { colors } from '../../design/tokens/colors';

const PLACEHOLDER_PROMOS = [
  { title: 'Promo — Release demo A', subtitle: 'Recibida · sin reproducir' },
  { title: 'Promo — Release demo B', subtitle: 'En escucha' },
  { title: 'Promo — Release demo C', subtitle: 'Feedback enviado' },
];

export function PromosInboxScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenTitle
          title="Promos"
          subtitle="Equipo 3 — Player inbox (mock)"
        />
        {PLACEHOLDER_PROMOS.map((item) => (
          <ListRowCard
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
});
```

### Por qué

Equipo 3 cubre la experiencia **receptor/artista** ([EQUIPO_3_FUNCIONAL.md](../EQUIPO_3_FUNCIONAL.md)). La inbox es P0 en diseño ([PANTALLAS_PARA_DISENO_PRIORIZADAS.md](../PANTALLAS_PARA_DISENO_PRIORIZADAS.md)).

### Cómo funciona

Misma idea de lista estática que el dashboard, pero con `ListRowCard`. Más adelante reemplazarás `PLACEHOLDER_PROMOS` por estado `const [promos, setPromos] = useState([])` llenado en `useEffect` + fetch; la **estructura visual** puede quedar igual.

---

## Paso 9 — Pantalla Equipo 4: Lista de releases (label)

### Qué

Listado de releases de ejemplo (catálogo), sin `GET /releases`.

### Cómo

**Archivo:** `src/screens/releases/ReleasesListScreen.tsx`

```tsx
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { ListRowCard } from '../../components/molecules/ListRowCard';
import { spacing } from '../../design/tokens/spacing';
import { colors } from '../../design/tokens/colors';

const PLACEHOLDER_RELEASES = [
  { title: 'EP Demo — Artista X', subtitle: 'EP · 2026' },
  { title: 'Album Demo — Artista Y', subtitle: 'ALBUM · 2025' },
];

export function ReleasesListScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenTitle
          title="Releases"
          subtitle="Equipo 4 — Catálogo (mock)"
        />
        {PLACEHOLDER_RELEASES.map((item) => (
          <ListRowCard
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
});
```

### Por qué

Equipo 4 opera releases y promos del label. La lista es lectura primero ([EQUIPO_4_FUNCIONAL.md](../EQUIPO_4_FUNCIONAL.md)); esta práctica solo monta la **jerarquía visual** antes de artwork y tracks.

### Cómo funciona

Reutilizás `ListRowCard` entre equipos 3 y 4: mismo aspecto de fila, distinto array de datos. Eso es reutilización de molecules sin copiar estilos.

---

## Paso 10 — Pantalla Equipo 5: Listas de audiencia (índice)

### Qué

Índice de listas de audiencia con nombres ficticios, sin `GET /recipient-lists`.

### Cómo

**Archivo:** `src/screens/audience/AudienceListsScreen.tsx`

```tsx
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { ListRowCard } from '../../components/molecules/ListRowCard';
import { PrimaryButton } from '../../components/atoms/PrimaryButton';
import { spacing } from '../../design/tokens/spacing';
import { colors } from '../../design/tokens/colors';

const PLACEHOLDER_LISTS = [
  { title: 'DJs locales', subtitle: '0 contactos (placeholder)' },
  { title: 'Prensa', subtitle: '0 contactos (placeholder)' },
];

export function AudienceListsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenTitle
          title="Listas de audiencia"
          subtitle="Equipo 5 — Recipient lists (mock)"
        />
        {PLACEHOLDER_LISTS.map((item) => (
          <ListRowCard
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
          />
        ))}
        <PrimaryButton
          title="Nueva lista (sin acción)"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl },
});
```

### Por qué

Equipo 5 gestiona `/recipient-lists` ([EQUIPO_5_FUNCIONAL.md](../EQUIPO_5_FUNCIONAL.md)). El botón “Nueva lista” anticipa la acción primaria; `onPress={() => {}}` deja claro que aún no hay navegación ni `POST`.

### Cómo funciona

El botón vacío no rompe nada: en la siguiente iteración reemplazás por `navigation.navigate('AudienceListCreate')` o un modal. La screen sigue siendo el lugar correcto para esa decisión, no el `ListRowCard`.

---

## Paso 11 — Menú de desarrollo (navegar entre las 5 pantallas)

### Qué

Una pantalla índice solo para la materia: enlaces a las cinco pantallas de equipo sin implementar aún tabs por rol.

### Cómo

**Archivo:** `src/screens/DevMenuScreen.tsx`

```tsx
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenTitle } from '../components/atoms/ScreenTitle';
import { PrimaryButton } from '../components/atoms/PrimaryButton';
import { spacing } from '../design/tokens/spacing';
import { colors } from '../design/tokens/colors';
import type { RootStackParamList } from '../navigation/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'DevMenu'>;

const LINKS: { label: string; route: keyof RootStackParamList }[] = [
  { label: 'Equipo 1 — Login', route: 'Login' },
  { label: 'Equipo 2 — Dashboard label', route: 'DashboardLabel' },
  { label: 'Equipo 3 — Promos inbox', route: 'PromosInbox' },
  { label: 'Equipo 4 — Releases', route: 'ReleasesList' },
  { label: 'Equipo 5 — Audience lists', route: 'AudienceLists' },
];

export function DevMenuScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScreenTitle
          title="Menú desarrollo"
          subtitle="Práctica B — saltar a cada pantalla"
        />
        {LINKS.map((link) => (
          <PrimaryButton
            key={link.route}
            title={link.label}
            onPress={() => navigation.navigate(link.route)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg, gap: spacing.sm },
});
```

### Por qué

En producción el arranque será Splash → login → stack por rol. En clase necesitás **probar las cinco UIs** sin simular sesión. `DevMenu` se elimina o se oculta más adelante.

### Cómo funciona

`navigation.navigate('Login')` apila (o muestra) la pantalla registrada con ese **name** en el Stack. Los nombres deben coincidir exactamente con `RootStackParamList` (tipado).

---

## Paso 12 — Registrar el stack de navegación

### Qué

Centralizar rutas y conectar todas las screens en un solo navigator.

### Cómo

**Archivo:** `src/navigation/RootStack.tsx`

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DevMenuScreen } from '../screens/DevMenuScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardLabelScreen } from '../screens/label/DashboardLabelScreen';
import { PromosInboxScreen } from '../screens/player/PromosInboxScreen';
import { ReleasesListScreen } from '../screens/releases/ReleasesListScreen';
import { AudienceListsScreen } from '../screens/audience/AudienceListsScreen';

export type RootStackParamList = {
  DevMenu: undefined;
  Login: undefined;
  DashboardLabel: undefined;
  PromosInbox: undefined;
  ReleasesList: undefined;
  AudienceLists: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DevMenu">
        <Stack.Screen
          name="DevMenu"
          component={DevMenuScreen}
          options={{ title: 'R8 — Dev' }}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen
          name="DashboardLabel"
          component={DashboardLabelScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          name="PromosInbox"
          component={PromosInboxScreen}
          options={{ title: 'Promos' }}
        />
        <Stack.Screen
          name="ReleasesList"
          component={ReleasesListScreen}
          options={{ title: 'Releases' }}
        />
        <Stack.Screen
          name="AudienceLists"
          component={AudienceListsScreen}
          options={{ title: 'Audience' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Por qué

`navigation/` separado de `App.tsx` evita que el entrypoint crezca sin control. `RootStackParamList` da **type-safety** en `navigate()`.

### Cómo funciona

1. `createNativeStackNavigator` fabrica un objeto `Stack` con `Navigator` y `Screen`.
2. Cada `Stack.Screen` asocia un **name** con un **component** (tu función `LoginScreen`, etc.).
3. `NavigationContainer` provee el contexto de navegación a todo el árbol.
4. `initialRouteName="DevMenu"` define la primera pantalla al abrir la app.
5. El header nativo (título + botón atrás) lo genera el stack; por eso ves “Login” arriba al entrar desde el menú.

Flujo al tocar “Equipo 1 — Login” en DevMenu:

```text
DevMenuScreen → navigation.navigate('Login') → Stack muestra LoginScreen
```

---

## Paso 13 — Simplificar `App.tsx`

### Qué

Que la raíz de la app solo monte `RootStack`.

### Cómo

Reemplazar el contenido de `App.tsx` por:

```tsx
import { RootStack } from './src/navigation/RootStack';

export default function App() {
  return <RootStack />;
}
```

### Por qué

`App.tsx` debe permanecer **delgado**: es el contrato con Expo (`registerRootComponent` en `index.ts` no cambia). Toda la app vive bajo `src/`.

### Cómo funciona

Expo carga `index.ts` → registra `App` → renderiza `<RootStack />` → `NavigationContainer` → pantalla inicial. El árbol de componentes que dibujaste en Práctica B cuelga de ahí.

---

## Paso 14 — Verificar en dispositivo o emulador

### Qué

Confirmar que compila y que podés recorrer las 5 pantallas.

### Cómo

```bash
npm start
```

Abrí en Expo Go o emulador. Deberías ver:

1. Menú desarrollo con 5 botones.
2. Cada botón abre su pantalla con controles estáticos o estado local (solo Login).
3. Botón **atrás** del sistema/header vuelve al menú.

### Por qué

Smoke test mínimo antes de dividir tareas por equipo en el repo.

### Cómo funciona

Metro empaqueta todos los `import` al iniciar. Si falta un archivo o hay typo en `navigate('Logn')`, TypeScript o runtime avisan. Errores frecuentes: olvidar `npx expo install`, rutas de import incorrectas (`../../` vs `../`), no exportar el componente con `export function`.

---

## Reparto sugerido en clase (por equipo)

| Equipo | Archivo principal a mantener/evolucionar | Controles clave en Práctica B |
|--------|------------------------------------------|-------------------------------|
| 1 | `src/screens/auth/LoginScreen.tsx` | `LabeledTextField`, `PrimaryButton`, `useState` |
| 2 | `src/screens/label/DashboardLabelScreen.tsx` | `StatCard`, layout en fila |
| 3 | `src/screens/player/PromosInboxScreen.tsx` | `ListRowCard`, lista mock |
| 4 | `src/screens/releases/ReleasesListScreen.tsx` | `ListRowCard`, lista mock |
| 5 | `src/screens/audience/AudienceListsScreen.tsx` | `ListRowCard`, botón placeholder |

Todos comparten: tokens, atoms base, `DevMenu`, `RootStack`. Acordar en PR quién toca `RootStack` (un alumno o el profe) para no pisarse.

---

## Checklist de entrega (Práctica B)

- [ ] Carpetas `src/design`, `src/components`, `src/screens`, `src/navigation` creadas.
- [ ] Tokens `colors` y `spacing` usados en al menos un componente.
- [ ] Tres atoms y tres molecules creados sin llamadas HTTP.
- [ ] Cinco pantallas de equipo con textos placeholder o estado local vacío.
- [ ] `RootStack` + `DevMenu` permiten navegar a las cinco.
- [ ] `App.tsx` delega en `RootStack`.
- [ ] App corre con `npm start` sin errores de import.

---

## Qué sigue (fuera de Práctica B)

1. **Organisms** (p. ej. `LoginForm` que agrupe campos + botón) para aligerar screens.
2. **Splash / bootstrap** con `useEffect` + refresh ([EQUIPO_1_FUNCIONAL.md](../EQUIPO_1_FUNCIONAL.md)).
3. **`src/services/api`** + DTOs de [DTOs_Y_CUERPOS_HTTP.md](../DTOs_Y_CUERPOS_HTTP.md).
4. Estados **loading / error / vacío** cuando deje de ser mock.
5. Stacks separados por rol (label vs artist) en lugar de `DevMenu`.

---

## Errores típicos en esta práctica

| Síntoma | Causa probable | Qué revisar |
|---------|----------------|-------------|
| `Unable to resolve module` | Ruta de import mal contada | `../` desde `screens/auth` hacia `components` |
| Pantalla en blanco | Componente no exportado o nombre mal en `Stack.Screen` | `export function` + `name=` igual que `ParamList` |
| `navigate` no hace nada | Typo en el string de ruta | `'Login'` vs `'login'` |
| Texto tapado por notch | Falta `SafeAreaView` | Envolver contenido en screen |
| Teclado tapa botones en Login | Falta `KeyboardAvoidingView` | Paso 6 |

---

*Documento de práctica B — complemento de CLASE_02. Alineado al plan en `docs/PLAN_TRABAJO_ALUMNOS_RN.md` y `docs/ATOMIC_DESIGN.md`.*

# Atomic Design en R8 Mobile

Guía para el proyecto **r8-mobile** (React Native + Expo + TypeScript). Está pensada para quienes ya programan (variables, funciones, componentes) pero recién se acercan al armado de apps “de verdad”: muchas pantallas, equipos en paralelo y código que tiene que seguir siendo entendible dentro de unas semanas.

Complementa el plan de trabajo en [PLAN_TRABAJO_ALUMNOS_RN.md](./PLAN_TRABAJO_ALUMNOS_RN.md) y la estructura esperada en [\_INIT.md](./_INIT.md). El front web **r8-site** usa la misma idea de capas; podés mirar su carpeta `src/components/` como referencia de nombres y tamaño de componentes (ahí se llama `pages/` a lo que acá suele llamarse `screens/`).

---

## 1. ¿Para qué sirve esto?

Sin convenciones, cada persona termina mezclando en un solo archivo:

- cómo se ve la pantalla,
- cómo se llama a la API,
- cómo se guarda el token,
- validaciones, mensajes de error, navegación…

Eso **funciona** al principio, pero se vuelve difícil de leer, de testear y de dividir entre varios alumnos.

**Atomic Design** no es una librería: es una **forma de ordenar la interfaz** en piezas de distinto tamaño, de la más chica a la más grande, con reglas claras de qué puede hacer cada una.

La metáfora es la de la química:

- **Átomos** → piezas mínimas, casi indivisibles.
- **Moléculas** → unas pocas piezas juntas con un propósito chico.
- **Organismos** → bloques grandes de la pantalla.
- **Plantillas (templates)** → esqueleto de pantalla sin datos reales (opcional pero útil).
- **Página / pantalla** → instancia concreta con datos y flujo (en mobile: **`screens/`**).

No hace falta memorizar la metáfora: lo importante es **el tamaño del componente** y **quién decide los datos**.

---

## 2. Los niveles (qué va en cada uno)

### 2.1 Atoms (`src/components/atoms/`)

**Qué son:** controles y trozos de UI muy pequeños, reutilizables en muchos contextos.

**Ejemplos:** botón estilizado, texto con tipografía de marca, campo de texto base, avatar vacío, icono envuelto en un `TouchableOpacity`.

**Reglas prácticas:**

- Reciben todo por **props** (texto, `onPress`, si está deshabilitado, etc.).
- **No llaman a la API** y **no saben** si estás en “login” o en “perfil artista”.
- Idealmente no importan otros componentes de _atoms_ salvo casos muy puntuos (mejor subir a _molecule_ si se complica).

En React Native suele ser un `View` / `Text` / `TextInput` / `Pressable` con estilos sacados de tokens (colores, espaciados) definidos en `src/design/tokens/` (ver plan en [PLAN_TRABAJO_ALUMNOS_RN.md](./PLAN_TRABAJO_ALUMNOS_RN.md)).

### 2.2 Molecules (`src/components/molecules/`)

**Qué son:** combinaciones **cortas** de atoms con un significado de UI claro.

**Ejemplos:** etiqueta + input + mensaje de error; fila de “título + valor”; tarjeta chica con icono + texto; barra de búsqueda (input + botón limpiar).

**Reglas prácticas:**

- Siguen siendo **presentación**: datos y acciones entran por props.
- Pueden tener **estado de UI local** muy chico (por ejemplo “¿el desplegable está abierto?”).
- **No llaman a la API** ni conocen endpoints.

### 2.3 Organisms (`src/components/organisms/`)

**Qué son:** secciones **grandes** de una pantalla: formulario completo, cabecera de perfil, lista con cabecera y acciones, panel de filtros.

**Reglas prácticas:**

- Arman layout complejo usando molecules y atoms.
- Suelen tener **varias** props y varios callbacks (`onSubmit`, `onChangePhoto`, `onLogout`).
- Aun así, la regla del curso es: **la API no se llama acá**; solo emiten eventos hacia arriba.

Si un organism empieza a importar `fetch` o el cliente HTTP, conviene **bajar** esa parte a un hook en `src/features/...` y dejar el organism como “tonto” (solo UI).

### 2.4 Templates (`src/components/templates/`) — opcional

**Qué son:** moldes de pantalla **sin datos de negocio**: por ejemplo “cabecera fija + área scroll + pie con botón primario”.

En **r8-site** existen cosas como layout de dashboard o de auth. En mobile puede servir lo mismo para que **todas** las pantallas de un flujo compartan márgenes, fondo y zona segura (`SafeAreaView`).

**Reglas:** solo estructura y slots (`children` o props de secciones). Sin fetch.

### 2.5 Screens (`src/screens/`) — la “página” del mobile

**Qué son:** lo que conectás con **navegación** (stack/tab): una pantalla por ruta o por paso importante del flujo.

**Acá sí:**

- Usás hooks (`useState`, `useEffect`, custom hooks de `src/features/...`).
- Llamás a servicios / API (directamente o a través de hooks).
- Manejás **carga, error y vacío** antes de mostrar el contenido.
- Pasás datos y callbacks a organisms/molecules.

En **r8-site** esto vive en `src/pages/`. El nombre cambia; el **rol** es el mismo: **orquestación**.

---

## 3. Cómo se relaciona con r8-site

| Idea                              | r8-site (React web)         | r8-mobile (React Native)               |
| --------------------------------- | --------------------------- | -------------------------------------- |
| Piezas pequeñas de UI             | `src/components/atoms/`     | `src/components/atoms/`                |
| Bloques medianos                  | `src/components/molecules/` | `src/components/molecules/`            |
| Bloques grandes                   | `src/components/organisms/` | `src/components/organisms/`            |
| Layout reutilizable               | `src/components/templates/` | `src/components/templates/` (opcional) |
| Pantalla con datos y lógica       | `src/pages/`                | `src/screens/`                         |
| Llamadas HTTP y reglas de dominio | `src/hooks/` + `src/api/`   | `src/features/` + `src/services/api/`  |

La API es la misma (**r8-api**); el contrato está en [REFERENCIA_API_R8.md](./REFERENCIA_API_R8.md) y los cuerpos en [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md). Atomic Design **no** define la API: solo ayuda a **no mezclar** “cómo se ve” con “de dónde salen los datos”.

---

## 4. Flujo de datos (resumen visual)

Una forma simple de acordar el flujo:

```text
Usuario toca UI (atom/molecule/organism)
        ↓
El componente NO “hace magia”: llama a una prop, ej. onLogin(email, password)
        ↓
La Screen recibe ese callback, llama al hook o servicio
        ↓
Llega la respuesta (éxito o error)
        ↓
La Screen actualiza estado y vuelve a pasar props a la UI
```

Si dibujás flechas y en algún punto aparece `fetch` o `apiClient` **dentro** de un atom, conviene **replantear**: casi seguro esa línea pertenece a la screen o a un hook.

---

## 5. Ejemplo mínimo (React Native)

No es código obligatorio del repo; sirve para ver la separación.

**Atom:** botón reutilizable.

```tsx
// src/components/atoms/PrimaryButton.tsx
import { Pressable, Text, StyleSheet } from "react-native";

type Props = { title: string; onPress: () => void; disabled?: boolean };

export function PrimaryButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
```

**Molecule:** etiqueta + input (sin saber de usuarios ni tokens).

```tsx
// src/components/molecules/LabeledTextField.tsx
import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  error?: string;
};

export function LabeledTextField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  error,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 4, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: { color: "#b00020", marginTop: 4, fontSize: 12 },
});
```

**Organism:** forma de login solo con props (la screen decide qué hacer al enviar).

```tsx
// src/components/organisms/LoginForm.tsx
import { View, Text, StyleSheet } from "react-native";
import { LabeledTextField } from "../molecules/LabeledTextField";
import { PrimaryButton } from "../atoms/PrimaryButton";

type Props = {
  email: string;
  password: string;
  onChangeEmail: (t: string) => void;
  onChangePassword: (t: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  errorMessage?: string;
};

export function LoginForm(props: Props) {
  const {
    email,
    password,
    onChangeEmail,
    onChangePassword,
    onSubmit,
    loading,
    errorMessage,
  } = props;
  return (
    <View style={styles.card}>
      <LabeledTextField
        label="Email"
        value={email}
        onChangeText={onChangeEmail}
      />
      <LabeledTextField
        label="Contraseña"
        value={password}
        onChangeText={onChangePassword}
        secureTextEntry
      />
      {errorMessage ? (
        <Text style={styles.formError}>{errorMessage}</Text>
      ) : null}
      <PrimaryButton
        title={loading ? "Entrando…" : "Entrar"}
        onPress={onSubmit}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  formError: { color: "#b00020", marginBottom: 12, fontSize: 14 },
});
```

**Screen:** acá van `useState`, llamada a `login` del servicio y navegación.

```tsx
// src/screens/LoginScreen.tsx
import { useState } from "react";
import { View, Alert } from "react-native";
import { LoginForm } from "../components/organisms/LoginForm";
// import { login } from '../services/api/auth'; // cuando exista el cliente

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      // await login({ email, password });
      Alert.alert("OK", "Acá iría la llamada a la API");
    } catch {
      Alert.alert("Error", "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <LoginForm
        email={email}
        password={password}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </View>
  );
}
```

Cuando el proyecto crezca, la lógica de `handleSubmit` puede mudarse a `src/features/auth/useLogin.ts` y la screen queda más legible aún.

---

## 6. Reglas que el equipo puede “copiar y pegar” en el README del sprint

1. **`atoms/` y `molecules/`:** solo UI; datos y eventos por props. Sin HTTP.
2. **`organisms/`:** UI compuesta; sin HTTP. Si “necesita datos”, recibirlos por props.
3. **`screens/`:** orquestación, navegación, hooks, llamadas a `src/services/api/`.
4. **Tipos/DTOs:** alineados a [DTOs_Y_CUERPOS_HTTP.md](./DTOs_Y_CUERPOS_HTTP.md); conviene `src/types/` o junto al servicio, pero **no duplicar** el mismo shape en diez archivos sin querer.
5. **Estados de pantalla:** para datos async, contemplar explícitamente **loading**, **error** y **vacío** (el plan de la cátedra lo pide).
6. **Nombres:** archivo `PascalCase` exportando un componente principal con el mismo nombre (`LoginForm.tsx` → `LoginForm`), como en r8-site.

---

## 7. Errores típicos (y cómo evitarlos)

| Situación                                           | Problema                                   | Ajuste                                                                                         |
| --------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| “El botón llama a la API”                           | Difícil de reutilizar y de testear         | La API se llama en la screen o en un hook; el botón solo `onPress`                             |
| “Este organism usa `useNavigation`”                 | Acopla un bloque de UI a una ruta concreta | Pasar callbacks (`onSuccess`, `onCancel`) desde la screen                                      |
| “Copié y pegué 40 líneas de estilos en 6 pantallas” | Cambios de diseño dolorosos                | Tokens en `src/design/tokens/` + atoms                                                         |
| “No sé si es molecule u organism”                   | Dudas normales                             | Si cabe en una vista mental “una cosa chica” → molecule; si es media pantalla o más → organism |

---

## 8. Checklist rápido antes de unir código a la rama principal

- [ ] ¿Los componentes bajo `components/` evitan importar `services/api`?
- [ ] ¿La screen maneja loading/error/vacío donde corresponde?
- [ ] ¿Los textos visibles al usuario son razonables y accesibles (contraste, tamaño)?
- [ ] ¿El componente nuevo tiene un lugar claro (atom / molecule / organism) y nombre que otros puedan adivinar?

---

## 9. Lecturas en este repo

- Plan y carpetas sugeridas: [PLAN_TRABAJO_ALUMNOS_RN.md](./PLAN_TRABAJO_ALUMNOS_RN.md) (sección 5).
- Estructura evolutiva: [\_INIT.md](./_INIT.md) (sección 3).
- Referencia web del mismo producto: repositorio **r8-site**, archivo `docs/ARCHITECTURE.md` (sección “Atomic Design” y “Flujo de datos”).

---

_Documento pensado para el cursado de R8 Mobile; podés proponer mejoras en clase o por PR._

---

_Documento creado en colaboración con Cursor._

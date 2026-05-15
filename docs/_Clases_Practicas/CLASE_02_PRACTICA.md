# Programación de dispositivos móviles

## Guía básica de React Native (con Expo + TypeScript)

---

## 1. ¿Qué es React Native?

**React Native** es un framework que permite crear aplicaciones móviles usando **JavaScript/TypeScript y React**.

A diferencia de React para web:

* **No usa HTML ni CSS**
* Usa **componentes nativos** (`View`, `Text`, `Button`)
* Renderiza **UI nativa real**, no una web dentro de una app

---

## 2. Punto de entrada de la aplicación

Cuando creamos un proyecto con:

```bash
npx create-expo-app@latest mi-app --template blank-typescript
```

El archivo principal es:

```
App.tsx
```

Ejemplo básico:

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View>
      <Text>Hola mundo</Text>
    </View>
  );
}
```

### Conceptos clave

* `App` es el **componente raíz**
* Todo lo que se renderiza parte desde ahí
* Es equivalente a `index.js` + `App.js` en React web

---

## 3. Componentes básicos

En React Native no usamos etiquetas HTML.

| Web      | React Native |
| -------- | ------------ |
| div      | View         |
| p / span | Text         |
| button   | Button       |

Ejemplo:

```tsx
<View>
  <Text>Texto</Text>
</View>
```

---

## 4. ¿Cómo funciona el render? (DOM vs Virtual DOM)

### En React web

* Existe el **DOM (Document Object Model)**
* React usa un **Virtual DOM** (copia en memoria)
* Compara cambios y actualiza solo lo necesario

### En React Native

* **No hay DOM**
* También existe un concepto similar a Virtual DOM
* React genera una **representación virtual**
* Luego se traduce a **componentes nativos reales**

Ejemplo:

* `<View>` → se convierte en un `UIView` (iOS) o `View` (Android)

---

## 5. Ciclo de vida de un componente (visión general)

Antes (clases):

* `componentDidMount`
* `componentDidUpdate`
* `componentWillUnmount`

Ahora (funcional + hooks):

* Todo se maneja con **hooks**, principalmente `useEffect`

### Flujo básico

1. El componente se monta
2. Se renderiza
3. Puede actualizarse (por cambios de estado)
4. Se desmonta

---

## 6. Hooks (concepto clave)

Los **hooks** son funciones especiales de React que permiten que un componente:

* Tenga **estado**
* Ejecute **lógica**
* Reaccione a cambios

Antes (React con clases):

* Solo los componentes de clase podían tener estado y ciclo de vida

Ahora (React moderno):

* Todo se hace con **funciones + hooks**

### Idea clave

Un hook permite “enganchar” (hook = gancho) lógica dentro del ciclo de vida del componente.

Forma simple de explicarlo en clase:

> Un hook es una función que le agrega “poderes” a tu componente

Ejemplos:

* `useState` → agrega memoria (estado)
* `useEffect` → agrega efectos (acciones externas)
* `useContext` → acceso a datos globales

### Reglas de los hooks (muy importantes)

#### Regla 1: solo dentro de componentes

```tsx
function App() {
  const [count, setCount] = useState(0); // ✅
}
```

Incorrecto:

```tsx
const [count, setCount] = useState(0); // fuera del componente
```

#### Regla 2: siempre en el nivel superior

Incorrecto:

```tsx
if (condicion) {
  useEffect(() => {});
}
```

Incorrecto:

```tsx
for (...) {
  useState(0);
}
```

React necesita que los hooks se ejecuten **en el mismo orden siempre**.

#### Regla 3: siempre empiezan con `use`

React usa eso para identificar hooks: `useState`, `useEffect`, `useCustomHook`, etc.

### Hooks más importantes (base mínima)

#### `useState` → estado

Guarda valores que cambian:

```tsx
const [nombre, setNombre] = useState("Juan");
```

Ejemplo completo:

```tsx
import { useState } from 'react';
import { Text, Button, View } from 'react-native';

export default function App() {
  const [contador, setContador] = useState(0);

  return (
    <View>
      <Text>{contador}</Text>
      <Button
        title="Sumar"
        onPress={() => setContador(contador + 1)}
      />
    </View>
  );
}
```

Conceptos:

* `contador`: valor actual
* `setContador`: función para actualizarlo
* Cada cambio → dispara un **re-render**

#### `useEffect` → efectos

Ejecuta lógica cuando pasa algo (se amplía en la sección 7):

```tsx
useEffect(() => {
  console.log("Algo cambió");
}, []);
```

#### `useContext` → datos globales

Permite compartir datos entre componentes sin pasar props (por ejemplo usuario logueado, tema claro/oscuro).

### Cómo piensa React con hooks

React **no** ejecuta tu código “una vez”. En cada render:

1. Ejecuta **toda** la función del componente otra vez
2. Vuelve a crear variables locales
3. Mantiene el estado internamente gracias a los hooks

Ejemplo mental:

```tsx
function App() {
  const [count, setCount] = useState(0);

  console.log("Render");

  return <Text>{count}</Text>;
}
```

Cada vez que cambia `count`, se ejecuta todo de nuevo, pero React “recuerda” el valor.

### Errores comunes con hooks

#### Error 1: pensar que las variables normales guardan estado

```tsx
let contador = 0;

contador++; // no funciona como la mayoría espera entre renders
```

Se reinicia en cada render.

#### Error 2: no entender closures

```tsx
useEffect(() => {
  console.log(contador);
}, []);
```

* Suele mostrar siempre el valor capturado en el primer render si no se corrigen dependencias.

#### Error 3: usar hooks como funciones normales en cualquier sitio

```tsx
function miFuncion() {
  useState(0); // ❌
}
```

### Crear tu propio hook (nivel intermedio básico)

Un hook es una función que usa otros hooks:

```tsx
function useContador() {
  const [count, setCount] = useState(0);

  const incrementar = () => setCount(count + 1);

  return { count, incrementar };
}
```

Uso:

```tsx
const { count, incrementar } = useContador();
```

### Forma correcta de pensarlo

Incorrecto:

> “Voy a ejecutar esta función cuando pase algo”

Correcto:

> “Voy a describir cómo debería comportarse el componente según su estado”

### Relación entre `useState` y `useEffect`

* `useState` → guarda datos
* `useEffect` → reacciona a esos datos

```tsx
const [contador, setContador] = useState(0);

useEffect(() => {
  console.log("Cambió el contador");
}, [contador]);
```

### Regla de oro (hooks)

> Si cambia algo en pantalla, probablemente es estado (`useState`).
> Si reaccionás a ese cambio con lógica externa o sincronización, probablemente es un efecto (`useEffect`).

---

## 7. Ciclo de vida con `useEffect` (en profundidad)

En React moderno (y React Native), el ciclo de vida **ya no se piensa en métodos separados**, sino en **momentos en los que ejecutamos efectos**. Eso se maneja con:

```tsx
useEffect()
```

### ¿Qué es un “efecto”?

Un **efecto** es cualquier cosa que **no** sea simplemente renderizar UI.

Ejemplos:

* Llamar a una API
* Leer datos
* Suscribirse a eventos
* Usar timers (`setTimeout`, `setInterval`)
* Acceder a almacenamiento

Regla simple:

> Si hace algo “por fuera” del render puro → es un efecto

### Sintaxis básica

```tsx
useEffect(() => {
  // código del efecto
}, [dependencias]);
```

Partes:

1. Una función (qué hacer)
2. Un array de dependencias (cuándo hacerlo)

### Los tres comportamientos clave

#### Caso 1: ejecutar una sola vez (montaje)

```tsx
useEffect(() => {
  console.log("Se montó el componente");
}, []);
```

* Se ejecuta **una sola vez** después del montaje
* Equivale a `componentDidMount` para ese caso de uso

Uso típico: llamadas a API, inicialización.

#### Caso 2: ejecutar cuando cambia algo

```tsx
useEffect(() => {
  console.log("El contador cambió");
}, [contador]);
```

* Se ejecuta cuando cambia `contador`
* También se ejecuta la primera vez

Uso típico: reaccionar a cambios de estado, sincronizar datos.

#### Caso 3: ejecutar en cada render

```tsx
useEffect(() => {
  console.log("Renderizó");
});
```

* Se ejecuta en **cada render**
* En general **no** es lo recomendado salvo casos muy puntuales

### Limpieza (cleanup)

Un efecto puede devolver una función:

```tsx
useEffect(() => {
  console.log("Se montó");

  return () => {
    console.log("Se desmontó");
  };
}, []);
```

Esa función se ejecuta:

* Cuando el componente se desmonta
* O **antes** de volver a ejecutar el efecto si cambian las dependencias

#### Ejemplo: timer

```tsx
useEffect(() => {
  const intervalo = setInterval(() => {
    console.log("Tick");
  }, 1000);

  return () => {
    clearInterval(intervalo);
  };
}, []);
```

Si no se limpia: pueden quedar timers o listeners activos después de desmontar (memory leaks, comportamiento raro).

### Orden real de ejecución

```tsx
useEffect(() => {
  console.log("Efecto");

  return () => {
    console.log("Cleanup");
  };
}, [contador]);
```

Cuando cambia `contador`:

1. Se ejecuta el **cleanup** del efecto anterior
2. Se ejecuta el **nuevo** efecto

Orden conceptual: `Cleanup` → `Efecto`.

### Errores comunes con `useEffect`

#### Error 1: dependencias incompletas

```tsx
useEffect(() => {
  console.log(contador);
}, []); // mal si el efecto debe reaccionar a contador
```

#### Error 2: bucle infinito

```tsx
useEffect(() => {
  setContador(contador + 1);
}, [contador]);
```

Cambio de estado → re-render → efecto → cambio de estado → …

#### Error 3: no limpiar suscripciones, listeners o timers

### Cómo pensarlo

Incorrecto:

> “Quiero que esto se ejecute después de renderizar”

Correcto:

> “Quiero que esto se ejecute cuando cambie X”

### Ejemplo completo

```tsx
import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    console.log("App montada");
  }, []);

  useEffect(() => {
    console.log("Contador:", contador);
  }, [contador]);

  return (
    <View>
      <Text>{contador}</Text>
      <Button
        title="Sumar"
        onPress={() => setContador(contador + 1)}
      />
    </View>
  );
}
```

### Equivalencia con ciclo de vida en clases

| Antes (clases)        | Ahora (hooks)     |
| --------------------- | ----------------- |
| `componentDidMount`   | `useEffect` + `[]` |
| `componentDidUpdate` | `useEffect` + deps |
| `componentWillUnmount` | función de cleanup en `useEffect` |

### Regla de oro (`useEffect`)

> Si tu efecto usa una variable del componente, normalmente debe estar en el array de dependencias.

### Resumen rápido de dependencias

| Dependencias | Cuándo se ejecuta   |
| ------------ | ------------------- |
| `[]`         | Solo al montar      |
| `[x]`        | Al montar y cuando cambia `x` |
| sin array    | Tras cada render    |

Ejemplo corto montaje / desmontaje:

```tsx
import { useEffect } from 'react';

useEffect(() => {
  console.log("El componente se montó");

  return () => {
    console.log("El componente se desmontó");
  };
}, []);
```

---

## 8. Navegación entre pantallas

React Native **no** trae navegación incluida. Lo habitual es usar **`@react-navigation/native`**.

### Diferencia con React Router (web)

| React Router (web)     | React Navigation (mobile) |
| ---------------------- | ------------------------- |
| URLs                   | Pila de pantallas         |
| Historial del navegador | Stack navigation         |
| `<Route>`              | `<Stack.Screen>`          |

### Ejemplo básico

```tsx
import { Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <Button
      title="Ir a detalles"
      onPress={() => navigation.navigate('Details')}
    />
  );
}

function DetailsScreen() {
  return <Text>Pantalla de detalles</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 9. ¿Qué dispara un re-render?

Un componente se vuelve a renderizar cuando:

* Cambia un estado (`useState`)
* Cambian las `props`
* Cambia el contexto (`useContext`)

React **no** repinta todo el árbol a ciegas: intenta actualizar solo lo necesario.

---

## 10. Buenas prácticas básicas

* Componentes pequeños y reutilizables
* Separar lógica y UI
* Evitar lógica compleja dentro del JSX cuando se pueda extraer
* Usar TypeScript para reducir errores en props y estado

---

## 11. Errores comunes de alumnos

* Modificar estado directamente

  ```tsx
  contador = contador + 1 // mal
  ```

* No entender que las actualizaciones de estado pueden ser asíncronas / agrupadas
* Usar hooks dentro de condiciones o bucles
* Pensar que React ejecuta el código “línea por línea” como un script secuencial sin re-renders

---

## 12. Resumen corto

* `App.tsx` → punto de entrada
* Componentes (`View`, `Text`, …) → base de la UI
* Virtual DOM / árbol de React → optimización y sincronización con nativo
* `useState` → estado local
* `useEffect` → efectos y ciclo de vida
* Navigation → pantallas y flujos en la app

---

## Ideas para práctica en clase

* Ejercicios donde ** fallen** dependencias en `useEffect` o aparezcan bucles infinitos, y luego corregirlos en grupo
* Debugging guiado: timers sin `clearInterval`, listeners sin remover
* Misma dinámica con reglas de hooks (hooks condicionados, etc.)

Perfecto, te armo un documento claro, didáctico y listo para compartir con tus alumnos 👇

---

# 📱 Guía de Inicio — Proyecto **R8 Mobile**

## 📌 Información general

- **Nombre del proyecto:** `R8`
- **Repositorio:** `r8-mobile`
- **Tecnología:** React Native
- **Objetivo:** Crear una aplicación móvil multiplataforma (Android + iOS)

---

# 🧰 1. Requisitos previos

Antes de comenzar, es necesario instalar las siguientes herramientas:

## 🔹 Node.js

- Descargar desde: [https://nodejs.org/](https://nodejs.org/)
- Verificar instalación:

```bash
node -v
npm -v
```

## 🔹 Git

- Descargar desde: [https://git-scm.com/](https://git-scm.com/)
- Verificar:

```bash
git --version
```

## 🔹 Watchman (solo macOS recomendado)

```bash
brew install watchman
```

## 🔹 Expo CLI (recomendado para comenzar)

Vamos a usar **Expo** porque simplifica muchísimo el desarrollo inicial.

```bash
npm install -g create-expo-app
```

---

# 🚀 2. Crear el proyecto

## 📁 Crear la app

```bash
npx create-expo-app r8-mobile
```

Durante el proceso:

- Elegir template: **blank (JavaScript)** (ya que no usan TypeScript)

## 📂 Entrar al proyecto

```bash
cd r8-mobile
```

## ▶️ Ejecutar el proyecto

```bash
npm start
```

Esto abrirá el panel de Expo en el navegador.

---

# 📱 3. Ejecutar en dispositivos

## Opción 1: Teléfono físico (recomendado para alumnos)

1. Instalar la app **Expo Go**
2. Escanear el QR que aparece en la terminal o navegador

---

## Opción 2: Emuladores

### Android (Windows / Linux / macOS)

- Instalar Android Studio
- Crear un emulador
- Ejecutar:

```bash
npm run android
```

### iOS (solo macOS)

- Instalar Xcode
- Ejecutar:

```bash
npm run ios
```

---

# 🗂️ 4. Estructura inicial del proyecto

```
r8-mobile/
├── App.js
├── package.json
├── assets/
└── node_modules/
```

### 📌 Archivo principal: `App.js`

Ejemplo inicial:

```javascript
import { Text, View } from "react-native";

export default function App() {
  return (
    <View>
      <Text>Bienvenidos a R8 🚀</Text>
    </View>
  );
}
```

---

# 🔧 5. Inicializar repositorio Git

## Crear repo local

```bash
git init
git add .
git commit -m "Initial commit - R8 project setup"
```

## Crear repositorio remoto (GitHub)

Nombre: `r8-mobile`

Luego vincular:

```bash
git remote add origin https://github.com/TU_USUARIO/r8-mobile.git
git branch -M main
git push -u origin main
```

---

# 📦 6. Scripts importantes

En `package.json`:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

---

# 🧪 7. Primer cambio de prueba

Modificar `App.js`:

```javascript
<Text>R8 App funcionando correctamente ✅</Text>
```

Guardar y ver cómo se actualiza automáticamente en el dispositivo.

---

# 📚 8. Conceptos clave a introducir a los alumnos

- Componentes (`View`, `Text`, `Button`)
- JSX
- Props
- Estado (`useState`)
- Estilos con `StyleSheet`
- Navegación (más adelante con React Navigation)

---

# 🧱 9. Buenas prácticas desde el inicio

Crear estructura básica:

```bash
mkdir src
mkdir src/components
mkdir src/screens
mkdir src/services
```

---

# 📌 10. Próximos pasos sugeridos para la cátedra

1. Crear pantalla de login
2. Navegación entre pantallas
3. Consumo de API
4. Manejo de estado
5. Persistencia local
6. Publicación de la app

---

# ⚠️ Notas importantes

- Expo simplifica el desarrollo, pero más adelante se puede migrar a **React Native CLI** si necesitan más control.
- iOS solo puede compilarse en macOS (salvo usando servicios en la nube como Expo EAS).

---

# 🎯 Objetivo de esta primera etapa

Que el alumno logre:

- Tener el entorno funcionando
- Ejecutar la app en su dispositivo
- Entender la estructura base
- Hacer sus primeras modificaciones

---

Si querés, en el siguiente paso puedo armarte:

- 📚 **Clase 1 completa (teórica + práctica)**
- 🧪 **Primer TP guiado**
- 🧱 **Arquitectura base recomendada para escalar el proyecto**
- 🔌 Integración con backend (ideal si querés conectarlo con algo tipo Node como lo que ya trabajás)

Solo decime 👍

<!-- Documento creado en colaboración con Cursor -->

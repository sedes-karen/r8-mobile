import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation/index';
import { useAppFonts } from './src/hooks/useAppFonts';
import { colors } from './src/constants/design';

// Main component moved here because it was trivial
function App() {
  // Gate mínimo de carga de fuentes (IBM Plex Mono) — no es la pantalla de Splash del roadmap
  // (esa sigue pendiente), solo evita un parpadeo con la fuente del sistema en el primer render.
  const fontsReady = useAppFonts();
  if (!fontsReady) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Navigation />
    </SafeAreaProvider>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

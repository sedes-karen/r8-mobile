import { registerRootComponent } from 'expo';
import { Navigation } from './src/navigation/index';

// Main component moved here because it was trivial
function App() {
  return <Navigation />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

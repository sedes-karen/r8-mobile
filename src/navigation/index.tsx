import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/design';

// Los providers
import { AuthInfoProvider, useIsArtist, useIsAuthenticated, useIsLabel, useIsNotAuthenticated } from '../features/auth/info';
// Fin de los providers

// Las pantallas
import { AuthLoginScreen } from '../screens/Auth/Login';
import { AuthSignUpScreen } from '../screens/Auth/SignUp';
import { AuthPasswordResetScreen } from '../screens/Auth/PasswordReset';
import { ArtistPromosPlayerScreen } from '../screens/Artist/Promos/Player';
import { ArtistPromosDetailsScreen } from '../screens/Artist/Promos/Details';
import { ArtistPromosFeedbackScreen } from '../screens/Artist/Promos/Feedback';
import { ArtistPromosLikedTracksScreen } from '../screens/Artist/Promos/LikedTracks';
import { ArtistProfileViewScreen } from '../screens/Artist/Profile/View';
import { ArtistProfileEditScreen } from '../screens/Artist/Profile/Edit';
import { LabelDashboardScreen } from '../screens/Label/Dashboard';
import { LabelProfileViewScreen } from '../screens/Label/Profile/View';
import { LabelProfileEditScreen } from '../screens/Label/Profile/Edit';
import { LabelAnalyticsScreen } from '../screens/Label/Analytics';
import { LabelReleasesListScreen } from '../screens/Label/Releases/List';
import { LabelReleasesNewScreen } from '../screens/Label/Releases/New';
import { LabelReleasesDetailsScreen } from '../screens/Label/Releases/Details';
import { LabelReleasesEditScreen } from '../screens/Label/Releases/Edit';
import { LabelReleasesPromosListScreen } from '../screens/Label/Releases/Promos/List';
import { LabelReleasesPromosNewScreen } from '../screens/Label/Releases/Promos/New';
import { LabelReleasesPromosDetailsScreen } from '../screens/Label/Releases/Promos/Details';
import { LabelReleasesPromosEditScreen } from '../screens/Label/Releases/Promos/Edit';
import { LabelRecipientListsListScreen } from '../screens/Label/RecipientLists/List';
import { LabelRecipientListsNewScreen } from '../screens/Label/RecipientLists/New';
import { LabelRecipientListsDetailsScreen } from '../screens/Label/RecipientLists/Details';
import { LabelRecipientListsEditScreen } from '../screens/Label/RecipientLists/Edit';
import { LabelRecipientListsFeedbackScreen } from '../screens/Label/RecipientLists/Feedback';
import { LabelRecipientListsBulkUploadScreen } from '../screens/Label/RecipientLists/BulkUpload';
// Fin de las pantallas

// headerShown: false en todos los niveles: con 2-3 navigators nativos anidados (Root > Artist >
// Promos, por ejemplo), cada uno mostraba su propio header por defecto apilado arriba del
// siguiente (se ve como una lista "Artist / Promos / Player" en vez de un solo header). Cada
// screen de este batch ya trae su propio título (AppText variant="headline-lg"), así que el
// header nativo queda redundante — lo apagamos acá en vez de pantalla por pantalla.
const NO_HEADER = { headerShown: false } as const;

// Tab bar mínima para poder navegar entre pantallas dentro de un rol — hasta este batch no
// existía ninguna forma de llegar a nada más allá de la screen inicial de cada stack (sin tabs
// ni menú, nada llamaba a navigation.navigate). Sigue la forma ya documentada en
// docs/screens.md § "Navegación" para Fase 3+ (Artist: Promos/Profile; Label: Dashboard/
// Releases/Lists), adelantada acá solo para que este batch se pueda probar — no reemplaza el
// rediseño de navegación real que hagan los equipos más adelante.
const TAB_BAR_OPTIONS = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary.default,
  tabBarInactiveTintColor: colors.onSurface.variant,
  tabBarStyle: { backgroundColor: colors.surface.containerLowest, borderTopColor: colors.surface.border },
} as const;

const AuthStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screenOptions: NO_HEADER,
  screens: {
    Login: AuthLoginScreen,
    SignUp: AuthSignUpScreen,
    PasswordReset: AuthPasswordResetScreen,
  }
} as const);

const ArtistStack = createBottomTabNavigator({
  initialRouteName: 'Promos',
  screenOptions: TAB_BAR_OPTIONS,
  screens: {
    Promos: createNativeStackNavigator({
      initialRouteName: 'Player',
      screenOptions: NO_HEADER,
      screens: {
        Player: ArtistPromosPlayerScreen,
        Details: ArtistPromosDetailsScreen,
        Feedback: ArtistPromosFeedbackScreen,
        LikedTracks: ArtistPromosLikedTracksScreen,
      },
    }),
    // Acceso directo además de la ruta anidada de arriba (Promos > LikedTracks): así se puede
    // llegar a Favoritos sin depender de que Player (todavía placeholder, no es de este batch)
    // tenga un link hacia ahí.
    Favoritos: ArtistPromosLikedTracksScreen,
    Perfil: createNativeStackNavigator({
      initialRouteName: 'View',
      screenOptions: NO_HEADER,
      screens: {
        View: ArtistProfileViewScreen,
        Edit: ArtistProfileEditScreen,
      },
    }),
  }
} as const);

const LabelStack = createBottomTabNavigator({
  initialRouteName: 'Dashboard',
  screenOptions: TAB_BAR_OPTIONS,
  screens: {
    Dashboard: LabelDashboardScreen,
    Analytics: LabelAnalyticsScreen,
    // Acceso directo a Releases > Promos > List — más abajo el tab "Releases" también llega
    // acá anidado, pero como Releases en sí sigue siendo placeholder (no es de este batch),
    // conviene un atajo directo para no depender de que alguien navegue Releases > Promos.
    Promos: LabelReleasesPromosListScreen,
    Recipients: createNativeStackNavigator({
      initialRouteName: 'List',
      screenOptions: NO_HEADER,
      screens: {
        List: LabelRecipientListsListScreen,
        New: LabelRecipientListsNewScreen,
        Details: LabelRecipientListsDetailsScreen,
        Edit: LabelRecipientListsEditScreen,
        Feedback: LabelRecipientListsFeedbackScreen,
        BulkUpload: LabelRecipientListsBulkUploadScreen,
      }
    }),
    Profile: createNativeStackNavigator({
      initialRouteName: 'View',
      screenOptions: NO_HEADER,
      screens: {
        View: LabelProfileViewScreen,
        Edit: LabelProfileEditScreen,
      },
    }),
    Releases: createNativeStackNavigator({
      initialRouteName: 'List',
      screenOptions: NO_HEADER,
      screens: {
        List: LabelReleasesListScreen,
        New: LabelReleasesNewScreen,
        Details: LabelReleasesDetailsScreen,
        Edit: LabelReleasesEditScreen,
        Promos: createNativeStackNavigator({
          initialRouteName: 'List',
          screenOptions: NO_HEADER,
          screens: {
            List: LabelReleasesPromosListScreen,
            New: LabelReleasesPromosNewScreen,
            Details: LabelReleasesPromosDetailsScreen,
            Edit: LabelReleasesPromosEditScreen,
          },
        }),
      }
    }),
  }
} as const);

const RootStack = createNativeStackNavigator({
  screenOptions: NO_HEADER,
  screens: {
    Auth: {
      screen: AuthStack,
      if: useIsNotAuthenticated,
    },
    Artist: {
      if: useIsArtist,
      screen: ArtistStack,
    },
    Label: {
      if: useIsLabel,
      screen: LabelStack,
    },
  },
} as const).
  // Todos los providers van acá abajo
  with(({ Navigator }) => (
    <AuthInfoProvider>
      <Navigator />
    </AuthInfoProvider>
  ));

export const Navigation = createStaticNavigation(RootStack);

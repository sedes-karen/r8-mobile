import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

const AuthStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Login: AuthLoginScreen,
    SignUp: AuthSignUpScreen,
    PasswordReset: AuthPasswordResetScreen,
  }
} as const);

const ArtistStack = createNativeStackNavigator({
  initialRouteName: 'Promos',
  screens: {
    Promos: createNativeStackNavigator({
      initialRouteName: 'Player',
      screens: {
        Player: ArtistPromosPlayerScreen,
        Details: ArtistPromosDetailsScreen,
        Feedback: ArtistPromosFeedbackScreen,
        LikedTracks: ArtistPromosLikedTracksScreen,
      },
    }),
    Profile: createNativeStackNavigator({
      initialRouteName: 'View',
      screens: {
        View: ArtistProfileViewScreen,
        Edit: ArtistProfileEditScreen,
      },
    }),
  }
} as const);

const LabelStack = createNativeStackNavigator({
  initialRouteName: 'Dashboard',
  screens: {
    Dashboard: LabelDashboardScreen,
    Analytics: LabelAnalyticsScreen,
    Profile: createNativeStackNavigator({
      initialRouteName: 'View',
      screens: {
        View: LabelProfileViewScreen,
        Edit: LabelProfileEditScreen,
      },
    }),
    Releases: createNativeStackNavigator({
      initialRouteName: 'List',
      screens: {
        List: LabelReleasesListScreen,
        New: LabelReleasesNewScreen,
        Details: LabelReleasesDetailsScreen,
        Edit: LabelReleasesEditScreen,
        Promos: createNativeStackNavigator({
          initialRouteName: 'List',
          screens: {
            List: LabelReleasesPromosListScreen,
            New: LabelReleasesPromosNewScreen,
            Details: LabelReleasesPromosDetailsScreen,
            Edit: LabelReleasesPromosEditScreen,
          },
        }),
      }
    }),
    RecipientLists: createNativeStackNavigator({
      initialRouteName: 'List',
      screens: {
        List: LabelRecipientListsListScreen,
        New: LabelRecipientListsNewScreen,
        Details: LabelRecipientListsDetailsScreen,
        Edit: LabelRecipientListsEditScreen,
        Feedback: LabelRecipientListsFeedbackScreen,
        BulkUpload: LabelRecipientListsBulkUploadScreen,
      }
    }),
  }
} as const);

const RootStack = createNativeStackNavigator({
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

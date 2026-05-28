import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { PasswordResetScreen } from "../screens/auth/PasswordResetScreen";
import { AuthInfoProvider, useIsAuthenticated, useIsNotAuthenticated } from "../features/auth/info";

const LoginStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Login: LoginScreen,
    SignUp: SignUpScreen,
    PasswordReset: PasswordResetScreen,
  }
} as const);

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Dashboard',
  screens: {
    Auth: {
      screen: LoginStack,
      if: useIsNotAuthenticated,
    },
    Dashboard: {
      screen: undefined as any, // TODO, may crash
      if: useIsAuthenticated,
    }
  }
} as const).with(({ Navigator }) => (
  <AuthInfoProvider>
    <Navigator />
  </AuthInfoProvider>
));

export const Navigation = createStaticNavigation(RootStack);

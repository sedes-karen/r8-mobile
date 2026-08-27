import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../../components/atoms/AppText';
import { LoginForm } from '../../components/organisms/LoginForm';
import { useLogin } from '../../features/auth/useLogin';

/** Pantalla Login — arma el estado local de los inputs y delega el request a useLogin. */
export function AuthLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { submit, loading, error } = useLogin();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.xl }}>
        <AppText variant="headline-lg">Iniciar sesión</AppText>
        <LoginForm
          email={email}
          password={password}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          onSubmit={() => submit(email, password)}
          loading={loading}
          error={error}
        />
      </View>
    </SafeAreaView>
  );
}

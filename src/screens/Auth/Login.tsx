import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../../components/atoms/AppText';
import { LoginForm } from '../../components/organisms/LoginForm';
import { useLogin } from '../../features/auth/useLogin';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pantalla Login — arma el estado local de los inputs y delega el request a useLogin. */
export function AuthLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { submit, loading, error } = useLogin();

  const handleSubmit = () => {
    const normalizedEmail = email.trim();
    const nextEmailError = !normalizedEmail
      ? 'Ingresá tu correo electrónico.'
      : EMAIL_PATTERN.test(normalizedEmail)
        ? null
        : 'Ingresá un correo electrónico válido.';
    const nextPasswordError = password.length === 0
      ? 'Ingresá tu contraseña.'
      : null;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    void submit(normalizedEmail, password);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.xl }}>
        <AppText variant="headline-lg">Iniciar sesión</AppText>
        <LoginForm
          email={email}
          password={password}
          onChangeEmail={handleEmailChange}
          onChangePassword={handlePasswordChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          emailError={emailError}
          passwordError={passwordError}
        />
      </View>
    </SafeAreaView>
  );
}

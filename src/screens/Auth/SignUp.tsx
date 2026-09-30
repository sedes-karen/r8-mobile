import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/atoms/AppText';
import { LinkButton } from '../../components/atoms/LinkButton';
import { RegisterForm } from '../../components/organisms/RegisterForm';
import { colors, spacing } from '../../constants/design';

export function AuthSignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError('El registro todavía no está conectado al servicio.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.lg }}>
        <View style={{ gap: spacing.xl }}>
          <AppText variant="headline-lg">Crear cuenta</AppText>
          <RegisterForm
            name={name}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            onChangeName={setName}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onChangeConfirmPassword={setConfirmPassword}
            onSubmit={handleSubmit}
            loading={false}
            error={error}
          />
          <LinkButton
            screen="Login"
            params={{}}
            style={({ pressed }) => ({
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <AppText variant="body-sm" color={colors.primary.default}>
              Volver a iniciar sesión
            </AppText>
          </LinkButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

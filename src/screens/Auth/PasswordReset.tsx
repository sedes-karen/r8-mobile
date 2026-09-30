import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/atoms/AppText';
import { LinkButton } from '../../components/atoms/LinkButton';
import { PasswordResetForm } from '../../components/organisms/PasswordResetForm';
import { colors, spacing } from '../../constants/design';

export function AuthPasswordResetScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError('La recuperación todavía no está conectada al servicio.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.lg }}>
        <View style={{ gap: spacing.xl }}>
          <AppText variant="headline-lg">Recuperar contraseña</AppText>
          <PasswordResetForm
            email={email}
            onChangeEmail={setEmail}
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

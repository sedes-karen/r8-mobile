import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/atoms/AppText';
import { LinkButton } from '../../components/atoms/LinkButton';
import { PasswordResetConfirmForm } from '../../components/organisms/PasswordResetConfirmForm';
import { PasswordResetForm } from '../../components/organisms/PasswordResetForm';
import { colors, spacing } from '../../constants/design';
import { usePasswordReset } from '../../features/auth/usePasswordReset';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResetStep = 'request' | 'confirm' | 'complete';

export function AuthPasswordResetScreen() {
  const [step, setStep] = useState<ResetStep>('request');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { loading, error, successMessage, requestCode, submitReset } = usePasswordReset();

  const handleRequestCode = async () => {
    const normalizedEmail = email.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationError('Ingresá un correo electrónico válido.');
      return;
    }

    setValidationError(null);
    const wasRequested = await requestCode(normalizedEmail);
    if (wasRequested) {
      setEmail(normalizedEmail);
      setStep('confirm');
    }
  };

  const handleReset = async () => {
    const wasReset = await submitReset({
      email,
      pin: pin.trim(),
      newPassword,
      confirmPassword,
    });
    if (wasReset) {
      setStep('complete');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.lg }}>
        <View style={{ gap: spacing.xl }}>
          <AppText variant="headline-lg">
            {step === 'complete' ? 'Contraseña actualizada' : 'Recuperar contraseña'}
          </AppText>

          {step === 'request' ? (
            <PasswordResetForm
              email={email}
              onChangeEmail={(value) => {
                setEmail(value);
                setValidationError(null);
              }}
              onSubmit={handleRequestCode}
              loading={loading}
              error={validationError ?? error}
            />
          ) : null}

          {step === 'confirm' ? (
            <PasswordResetConfirmForm
              code={pin}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              onChangeCode={setPin}
              onChangeNewPassword={setNewPassword}
              onChangeConfirmPassword={setConfirmPassword}
              onSubmit={handleReset}
              loading={loading}
              error={error}
              successMessage={successMessage}
            />
          ) : null}

          {step === 'complete' ? (
            <AppText variant="body-sm" color={colors.secondary.default}>
              {successMessage || 'La contraseña se actualizó correctamente. Ya podés iniciar sesión.'}
            </AppText>
          ) : null}

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

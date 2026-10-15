import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/atoms/AppText';
import { LinkButton } from '../../components/atoms/LinkButton';
import { RegisterForm } from '../../components/organisms/RegisterForm';
import { VerifyEmailForm } from '../../components/organisms/VerifyEmailForm';
import { colors, spacing } from '../../constants/design';
import { useRegistration } from '../../features/auth/useRegistration';
import type { AppRole } from '../../types/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthSignUpScreen() {
  const [role, setRole] = useState<AppRole>('artist');
  const [labelName, setLabelName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { loading, error, register, verify, resend } = useRegistration();

  const handleRegister = async () => {
    const normalizedEmail = email.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setFormError('Ingresá un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setFormError(null);
    const registeredEmail = await register({
      email: normalizedEmail,
      password,
      role,
      ...(role === 'label'
        ? { labelName: labelName.trim() || undefined }
        : {
            artistName: artistName.trim() || undefined,
            firstName: firstName.trim() || undefined,
            lastName: lastName.trim() || undefined,
          }),
    });

    if (registeredEmail) {
      setPendingEmail(registeredEmail);
      setMessage(null);
    }
  };

  const handleVerify = async () => {
    if (!pendingEmail) return;
    await verify(pendingEmail, pin.trim(), role);
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    const didResend = await resend(pendingEmail);
    setMessage(didResend ? 'Si la cuenta sigue pendiente, enviamos un nuevo código.' : null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.lg }}>
        <View style={{ gap: spacing.xl }}>
          <AppText variant="headline-lg">
            {pendingEmail ? 'Verificar correo' : 'Crear cuenta'}
          </AppText>
          {pendingEmail ? (
            <VerifyEmailForm
              email={pendingEmail}
              pin={pin}
              onChangePin={(value) => {
                setPin(value);
                setMessage(null);
              }}
              onSubmit={handleVerify}
              onResend={handleResend}
              loading={loading}
              error={error}
              message={message}
            />
          ) : (
            <RegisterForm
              role={role}
              labelName={labelName}
              artistName={artistName}
              firstName={firstName}
              lastName={lastName}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              onChangeRole={setRole}
              onChangeLabelName={setLabelName}
              onChangeArtistName={setArtistName}
              onChangeFirstName={setFirstName}
              onChangeLastName={setLastName}
              onChangeEmail={(value) => {
                setEmail(value);
                setFormError(null);
              }}
              onChangePassword={(value) => {
                setPassword(value);
                setFormError(null);
              }}
              onChangeConfirmPassword={(value) => {
                setConfirmPassword(value);
                setFormError(null);
              }}
              onSubmit={handleRegister}
              loading={loading}
              error={formError ?? error}
            />
          )}
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

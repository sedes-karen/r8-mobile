import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';

type VerifyEmailFormProps = {
  email: string;
  pin: string;
  onChangePin: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  loading: boolean;
  error: string | null;
  message: string | null;
};

export function VerifyEmailForm({
  email,
  pin,
  onChangePin,
  onSubmit,
  onResend,
  loading,
  error,
  message,
}: VerifyEmailFormProps) {
  return (
    <View style={{ gap: spacing.md }}>
      <AppText variant="body-sm" color={colors.onSurface.variant}>
        Ingresá el código de 4 caracteres que enviamos a {email}.
      </AppText>
      <LabeledInput
        label="Código de verificación"
        value={pin}
        onChangeText={onChangePin}
        maxLength={4}
        keyboardType="number-pad"
        placeholder="1234"
        editable={!loading}
      />
      {error ? <ErrorMessage message={error} /> : null}
      {message ? (
        <AppText variant="body-sm" color={colors.secondary.default}>
          {message}
        </AppText>
      ) : null}
      <Button
        label="Verificar correo"
        onPress={onSubmit}
        loading={loading}
        disabled={pin.trim().length !== 4}
      />
      <Button
        label="Reenviar código"
        variant="secondary"
        onPress={onResend}
        disabled={loading}
      />
    </View>
  );
}

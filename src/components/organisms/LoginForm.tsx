import { View } from 'react-native';
import { spacing } from '../../constants/design';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';

type LoginFormProps = {
  email: string;
  password: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
};

/**
 * Organismo de layout — arma el formulario de login a partir de átomos/moléculas.
 * Sin HTTP acá: la screen es quien conecta esto con useLogin (ver ATOMIC_DESIGN.md §3).
 */
export function LoginForm({ email, password, onChangeEmail, onChangePassword, onSubmit, loading, error }: LoginFormProps) {
  return (
    <View style={{ gap: spacing.md }}>
      <LabeledInput
        label="Email"
        value={email}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="tu@email.com"
        editable={!loading}
      />
      <LabeledInput
        label="Contraseña"
        value={password}
        onChangeText={onChangePassword}
        autoCapitalize="none"
        autoComplete="password"
        secureTextEntry
        placeholder="••••••••"
        editable={!loading}
      />
      {error ? <ErrorMessage message={error} /> : null}
      <Button label="Ingresar" onPress={onSubmit} loading={loading} disabled={!email || !password} />
    </View>
  );
}

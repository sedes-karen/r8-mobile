import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        secureTextEntry={!isPasswordVisible}
        placeholder="••••••••"
        editable={!loading}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        accessibilityHint={isPasswordVisible ? 'Oculta los caracteres de la contraseña' : 'Muestra los caracteres de la contraseña'}
        disabled={loading}
        onPress={() => setIsPasswordVisible((isVisible) => !isVisible)}
        style={({ pressed }) => ({
          alignSelf: 'flex-end',
          justifyContent: 'center',
          minHeight: 44,
          paddingVertical: spacing.xs,
          opacity: pressed || loading ? 0.6 : 1,
        })}
      >
        <AppText variant="body-sm" color={colors.primary.default}>
          {isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        </AppText>
      </Pressable>
      {error ? <ErrorMessage message={error} /> : null}
      <Button label="Ingresar" onPress={onSubmit} loading={loading} disabled={!email || !password} />
    </View>
  );
}

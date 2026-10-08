import { View } from 'react-native';
import type { AppRole } from '../../types/auth';
import { spacing } from '../../constants/design';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';

type RegisterFormProps = {
  role: AppRole;
  labelName: string;
  artistName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  onChangeRole: (value: AppRole) => void;
  onChangeLabelName: (value: string) => void;
  onChangeArtistName: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
};

export function RegisterForm({
  role,
  labelName,
  artistName,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  onChangeRole,
  onChangeLabelName,
  onChangeArtistName,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  onSubmit,
  loading,
  error,
}: RegisterFormProps) {
  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Button
            label="Artista"
            variant={role === 'artist' ? 'primary' : 'secondary'}
            onPress={() => onChangeRole('artist')}
            disabled={loading}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label="Sello"
            variant={role === 'label' ? 'primary' : 'secondary'}
            onPress={() => onChangeRole('label')}
            disabled={loading}
          />
        </View>
      </View>

      {role === 'label' ? (
        <LabeledInput
          label="Nombre del sello (opcional)"
          value={labelName}
          onChangeText={onChangeLabelName}
          editable={!loading}
        />
      ) : (
        <>
          <LabeledInput
            label="Nombre artístico (opcional)"
            value={artistName}
            onChangeText={onChangeArtistName}
            editable={!loading}
          />
          <LabeledInput
            label="Nombre (opcional)"
            value={firstName}
            onChangeText={onChangeFirstName}
            autoComplete="given-name"
            editable={!loading}
          />
          <LabeledInput
            label="Apellido (opcional)"
            value={lastName}
            onChangeText={onChangeLastName}
            autoComplete="family-name"
            editable={!loading}
          />
        </>
      )}

      <LabeledInput
        label="Correo electrónico"
        value={email}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="tu@email.com"
        editable={!loading}
      />
      <LabeledInput
        label="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChangeText={onChangePassword}
        autoCapitalize="none"
        autoComplete="new-password"
        secureTextEntry
        placeholder="••••••••"
        editable={!loading}
      />
      <LabeledInput
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={onChangeConfirmPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        secureTextEntry
        placeholder="••••••••"
        editable={!loading}
      />

      {error ? <ErrorMessage message={error} /> : null}

      <Button
        label="Registrarse"
        onPress={onSubmit}
        loading={loading}
        disabled={!email || !password || !confirmPassword}
      />
    </View>
  );
}

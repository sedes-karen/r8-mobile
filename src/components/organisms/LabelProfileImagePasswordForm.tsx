import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';
import { SuccessNotice } from '../molecules/SuccessNotice';

type Props = {
  imageUrl: string | null;
  fallbackName: string;
  uploading: boolean;
  uploadError: string | null;
  imageSaved: boolean;
  onPickImage: () => void;
  changingPassword: boolean;
  passwordError: string | null;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
};

const MIN_PASSWORD_LENGTH = 6;


export function LabelProfileImagePasswordForm({
  imageUrl,
  fallbackName,
  uploading,
  uploadError,
  imageSaved,
  onPickImage,
  changingPassword,
  passwordError,
  onChangePassword,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    setValidationError(null);
    if (newPassword !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setValidationError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      return;
    }
    onChangePassword(currentPassword, newPassword);
  };

  return (
    <View style={styles.block}>
      <View style={styles.section}>
        <AppText variant="title-md">Imagen de perfil</AppText>
        <View style={styles.avatarRow}>
          <Avatar imageUrl={imageUrl} fallbackName={fallbackName} size={96} />
          <Button
            label="Cambiar imagen"
            variant="secondary"
            onPress={onPickImage}
            loading={uploading}
            disabled={uploading}
          />
        </View>
        {uploadError ? <ErrorMessage message={uploadError} /> : null}
        {imageSaved ? <SuccessNotice title="Imagen actualizada" /> : null}
      </View>

      <View style={styles.section}>
        <AppText variant="title-md">Cambiar contraseña</AppText>
        <LabeledInput
          label="Contraseña actual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!changingPassword}
        />
        <LabeledInput
          label="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!changingPassword}
        />
        <LabeledInput
          label="Confirmar nueva contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!changingPassword}
        />
        {validationError ? <ErrorMessage message={validationError} /> : null}
        {passwordError ? <ErrorMessage message={passwordError} /> : null}
        <Button
          label="Cambiar contraseña"
          variant="secondary"
          onPress={handleSubmit}
          loading={changingPassword}
          disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.xl },
  section: { gap: spacing.md },
  avatarRow: { alignItems: 'center', gap: spacing.md },
});
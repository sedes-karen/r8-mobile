import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Avatar } from '../../../components/atoms/Avatar';
import { Button } from '../../../components/atoms/Button';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { LabeledInput } from '../../../components/molecules/LabeledInput';
import { useLabelProfile } from '../../../features/label/useLabelProfile';
import { useUpdateLabelProfile } from '../../../features/label/useUpdateLabelProfile';
import { useLabelImage } from '../../../features/label/useLabelImage';
import { useChangePassword } from '../../../features/label/useChangePassword';
import { useAuthActions } from '../../../features/auth/info';

/** Perfil label editable: datos del sello, imagen de perfil y cambio de contraseña. */
export function LabelProfileEditScreen() {
  const profile = useLabelProfile();
  const { submit: saveProfile, loading: saving, error: saveError } = useUpdateLabelProfile();
  const { uploadImage, loading: uploading, error: uploadError } = useLabelImage();
  const { changePassword, loading: changingPassword, error: passwordError } = useChangePassword();
  const { logout } = useAuthActions();

  const data = profile.status === 'success' ? profile.data : null;

  const [name, setName] = useState(data?.name ?? '');
  const [description, setDescription] = useState(data?.description ?? '');
  const [instagramUrl, setInstagramUrl] = useState(data?.instagramUrl ?? '');
  const [soundcloudUrl, setSoundcloudUrl] = useState(data?.soundcloudUrl ?? '');
  const [bandcampUrl, setBandcampUrl] = useState(data?.bandcampUrl ?? '');
  const [twitterUrl, setTwitterUrl] = useState(data?.twitterUrl ?? '');
  const [imageUrl, setImageUrl] = useState(data?.profileImageUrl ?? null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordErrorVisible, setPasswordErrorVisible] = useState<string | null>(null);

  if (profile.status === 'loading') {
    return <LoadingBlock label="Cargando perfil..." />;
  }

  if (profile.status === 'error') {
    return <ErrorState message={profile.message} onRetry={profile.reload} />;
  }

  const handleSaveProfile = async () => {
    setProfileSaved(false);
    const ok = await saveProfile({
      name: name || undefined,
      description: description || undefined,
      instagramUrl: instagramUrl || undefined,
      soundcloudUrl: soundcloudUrl || undefined,
      bandcampUrl: bandcampUrl || undefined,
      twitterUrl: twitterUrl || undefined,
    });
    if (ok) {
      setProfileSaved(true);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const ok = await uploadImage(asset.uri, asset.mimeType ?? 'image/jpeg');
    if (ok) {
      setImageUrl(asset.uri);
    }
  };

  const handleChangePassword = async () => {
    setPasswordErrorVisible(null);
    if (newPassword !== confirmPassword) {
      setPasswordErrorVisible('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorVisible('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    const ok = await changePassword(currentPassword, newPassword);
    if (ok) {
      logout();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}>
        <AppText variant="headline-lg">Editar perfil</AppText>

        {/* Datos del sello */}
        <View style={{ gap: spacing.md }}>
          <AppText variant="title-md">Datos del sello</AppText>
          <LabeledInput label="Nombre" value={name} onChangeText={setName} />
          <LabeledInput label="Descripción" value={description} onChangeText={setDescription} multiline />
          <LabeledInput label="Instagram" value={instagramUrl} onChangeText={setInstagramUrl} autoCapitalize="none" />
          <LabeledInput label="SoundCloud" value={soundcloudUrl} onChangeText={setSoundcloudUrl} autoCapitalize="none" />
          <LabeledInput label="Bandcamp" value={bandcampUrl} onChangeText={setBandcampUrl} autoCapitalize="none" />
          <LabeledInput label="Twitter" value={twitterUrl} onChangeText={setTwitterUrl} autoCapitalize="none" />
          {saveError ? <ErrorMessage message={saveError} /> : null}
          {profileSaved ? <ErrorMessage message="Cambios guardados" /> : null}
          <Button label="Guardar cambios" onPress={handleSaveProfile} loading={saving} />
        </View>

        {/* Imagen de perfil */}
        <View style={{ gap: spacing.md }}>
          <AppText variant="title-md">Imagen de perfil</AppText>
          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <Avatar imageUrl={imageUrl} fallbackName={name || 'Label'} size={96} />
            <Button label="Cambiar imagen" variant="secondary" onPress={handlePickImage} loading={uploading} />
          </View>
          {uploadError ? <ErrorMessage message={uploadError} /> : null}
        </View>

        {/* Cambio de contraseña */}
        <View style={{ gap: spacing.md }}>
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
          {passwordErrorVisible ? <ErrorMessage message={passwordErrorVisible} /> : null}
          {passwordError ? <ErrorMessage message={passwordError} /> : null}
          <Button
            label="Cambiar contraseña"
            variant="secondary"
            onPress={handleChangePassword}
            loading={changingPassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

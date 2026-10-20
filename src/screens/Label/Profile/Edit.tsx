import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { LabelProfileDataForm } from '../../../components/organisms/LabelProfileDataForm';
import { LabelProfileImagePasswordForm } from '../../../components/organisms/LabelProfileImagePasswordForm';
import { useLabelProfile } from '../../../features/label/useLabelProfile';
import { useUpdateLabelProfile } from '../../../features/label/useUpdateLabelProfile';
import { useLabelImage } from '../../../features/label/useLabelImage';
import { useChangePassword } from '../../../features/label/useChangePassword';
import { useAuthActions } from '../../../features/auth/info';


export function LabelProfileEditScreen() {
  const profile = useLabelProfile();
  const { submit: saveProfile, loading: saving, error: saveError } = useUpdateLabelProfile();
  const { uploadImage, loading: uploading, error: uploadError } = useLabelImage();
  const { changePassword, loading: changingPassword, error: passwordError } = useChangePassword();
  const { logout } = useAuthActions();


  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [imageSaved, setImageSaved] = useState(false);

  if (profile.status === 'loading') {
    return <LoadingBlock label="Cargando perfil..." />;
  }

  if (profile.status === 'error') {
    return <ErrorState message={profile.message} onRetry={profile.reload} />;
  }

  const data = profile.data;

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setImageSaved(false);
    const ok = await uploadImage(asset.uri, asset.mimeType ?? 'image/jpeg');
    if (ok) {
      setPickedImageUri(asset.uri);
      setImageSaved(true);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    const ok = await changePassword(currentPassword, newPassword);
    if (ok) {
      Alert.alert('Contraseña actualizada', 'Iniciá sesión nuevamente', [
        { text: 'OK', onPress: logout },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="headline-lg">Editar perfil</AppText>

        <LabelProfileDataForm
          initial={data}
          onSubmit={saveProfile}
          saving={saving}
          errorMessage={saveError}
        />

        <LabelProfileImagePasswordForm
          imageUrl={pickedImageUri ?? data.profileImageUrl}
          fallbackName={data.name ?? 'Label'}
          uploading={uploading}
          uploadError={uploadError}
          imageSaved={imageSaved}
          onPickImage={handlePickImage}
          changingPassword={changingPassword}
          passwordError={passwordError}
          onChangePassword={handleChangePassword}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.xl },
});
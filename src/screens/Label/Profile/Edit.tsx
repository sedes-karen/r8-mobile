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
import { fetchLabelMe } from '../../../services/api/labelsApi';

export function LabelProfileEditScreen() {
  const profile = useLabelProfile();

  const {
    submit: saveProfile,
    loading: saving,
    error: saveError,
  } = useUpdateLabelProfile();

  const {
    uploadImage,
    loading: uploading,
    error: uploadError,
  } = useLabelImage();

  const {
    changePassword,
    loading: changingPassword,
    error: passwordError,
  } = useChangePassword();

  const { logout } = useAuthActions();

  const [confirmedImageUrl, setConfirmedImageUrl] = useState<string | null>(null);
  const [refreshingImage, setRefreshingImage] = useState(false);
  const [imageSaved, setImageSaved] = useState(false);

  if (profile.status === 'loading') {
    return <LoadingBlock label="Cargando perfil..." />;
  }

  if (profile.status === 'error') {
    return <ErrorState message={profile.message} onRetry={profile.reload} />;
  }

  const data = profile.data;

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      if (!asset) return;

      setImageSaved(false);

      const ok = await uploadImage(
        asset.uri,
        asset.mimeType ?? 'image/jpeg',
      );

      if (!ok) return;

      setImageSaved(true);
      setRefreshingImage(true);

      try {
        const updatedProfile = await fetchLabelMe();

        setConfirmedImageUrl(updatedProfile.profileImageUrl);
      } catch {
        Alert.alert(
          'No se pudo refrescar el avatar',
          'La imagen se subió, pero no se pudo consultar el perfil actualizado. Volvé a cargar el perfil.',
        );
      } finally {
        setRefreshingImage(false);
      }
    } catch (error) {
      Alert.alert(
        'No se pudo actualizar la imagen',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al seleccionar o subir la imagen.',
      );
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      const ok = await changePassword(currentPassword, newPassword);

      if (!ok) return;

      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña se cambió correctamente. Volvé a iniciar sesión.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              logout();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      Alert.alert(
        'No se pudo cambiar la contraseña',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al cambiar la contraseña.',
      );
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
          imageUrl={confirmedImageUrl ?? data.profileImageUrl}
          fallbackName={data.name ?? 'Label'}
          uploading={uploading || refreshingImage}
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
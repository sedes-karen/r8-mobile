
import { useState } from 'react';
import {
  Image,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Avatar } from '../../../components/atoms/Avatar';
import { Button } from '../../../components/atoms/Button';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { useArtistProfile } from '../../../features/artist/useArtistProfile';
import { useArtistImage } from '../../../features/artist/useArtistImage';

export function ArtistProfileEditScreen() {
  const navigation = useNavigation<any>();
  const profile = useArtistProfile();
  const imageUpload = useArtistImage();

  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [contentType, setContentType] = useState('image/jpeg');

  if (profile.status === 'loading') {
    return <LoadingBlock label="Cargando perfil..." />;
  }

  if (profile.status === 'error') {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background, padding: spacing.lg }}
      >
        <AppText>{profile.message}</AppText>
        <Button label="Reintentar" onPress={profile.reload} />
      </SafeAreaView>
    );
  }

  const artist = profile.data;
  const displayName =
    artist.artistName || `${artist.firstName} ${artist.lastName}`;

  async function chooseImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        'Permití el acceso a tus fotos para elegir una imagen de perfil.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setSelectedUri(asset.uri);
    setContentType(asset.mimeType || 'image/jpeg');
  }

  async function saveImage() {
    if (!selectedUri) {
      return;
    }

    try {
      await imageUpload.uploadImage(selectedUri, contentType);
      await profile.reload();
      setSelectedUri(null);

      Alert.alert('Imagen actualizada', 'Tu foto de perfil se guardó correctamente.');
    } catch (error) {
      Alert.alert(
        'Error al subir la imagen',
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la foto.',
      );
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
          alignItems: 'center',
        }}
      >
        <AppText variant="headline-lg">Foto de perfil</AppText>

        {selectedUri ? (
          <Image
            source={{ uri: selectedUri }}
            style={{ width: 160, height: 160, borderRadius: 80 }}
          />
        ) : (
          <Avatar
            imageUrl={artist.profileImageUrl}
            fallbackName={displayName}
            size={160}
          />
        )}

        <AppText>
          Elegí una imagen cuadrada para usar como foto de perfil.
        </AppText>

        <View style={{ width: '100%', gap: spacing.md }}>
          <Button
            label="Elegir imagen"
            variant="secondary"
            onPress={chooseImage}
            disabled={imageUpload.status === 'loading'}
          />

          <Button
            label={
              imageUpload.status === 'loading'
                ? 'Subiendo imagen...'
                : 'Guardar foto'
            }
            onPress={saveImage}
            loading={imageUpload.status === 'loading'}
            disabled={!selectedUri || imageUpload.status === 'loading'}
          />

          {imageUpload.status === 'error' && (
            <AppText>{imageUpload.message}</AppText>
          )}

          <Button
            label="Volver al perfil"
            variant="secondary"
            onPress={() => navigation.goBack()}
            disabled={imageUpload.status === 'loading'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

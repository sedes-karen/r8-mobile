import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinkButton } from '../../../components/atoms/LinkButton';
import { borderRadius, colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Avatar } from '../../../components/atoms/Avatar';
import { Button } from '../../../components/atoms/Button';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { ProfileField } from '../../../components/molecules/ProfileField';
import { useArtistProfile } from '../../../features/artist/useArtistProfile';
import { useAuthActions } from '../../../features/auth/info';

/** Perfil de artista — solo lectura, con acceso a la edición (ArtistProfileEditScreen). */
export function ArtistProfileViewScreen() {
  const state = useArtistProfile();
  const { logout } = useAuthActions();

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando perfil..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const artist = state.data;
  const displayName = artist.artistName || `${artist.firstName} ${artist.lastName}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Avatar imageUrl={artist.profileImageUrl} fallbackName={displayName} size={96} />
          <AppText variant="headline-lg">{displayName}</AppText>
        </View>

        <View style={{ gap: spacing.md }}>
          <ProfileField label="Bio" value={artist.bio} />
          <ProfileField label="Instagram" value={artist.instagramUrl} />
          <ProfileField label="SoundCloud" value={artist.soundcloudUrl} />
          <ProfileField label="Bandcamp" value={artist.bandcampUrl} />
        </View>

        <LinkButton
          screen="Edit"
          params={{}}
          style={{
            alignSelf: 'center',
            borderWidth: 2,
            borderColor: colors.surface.containerHigh,
            borderRadius: borderRadius.full,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.xl,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
          }}
        >
          <AppText variant="title-md" color={colors.onSurface.default}>Editar</AppText>
        </LinkButton>
        <Button label="Cerrar sesión" variant="secondary" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}

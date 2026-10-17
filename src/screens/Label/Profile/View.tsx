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
import { useLabelProfile } from '../../../features/label/useLabelProfile';
import { useAuthActions } from '../../../features/auth/info';
import { Modal as NativeModal} from 'react-native';
import { useState } from 'react';
import { Modal as ConfirmationModal } from '../../../components/molecules/Modal';

export function LabelProfileViewScreen() {
  const state = useLabelProfile();
  const { logout } = useAuthActions();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando perfil..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const label = state.data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Avatar imageUrl={label.profileImageUrl} fallbackName={label.name ?? ''} size={96} />
          <AppText variant="headline-lg">{label.name ?? 'Sin nombre'}</AppText>
        </View>

        <View style={{ gap: spacing.md }}>
          <ProfileField label="Descripción" value={label.description} />
          <ProfileField label="Instagram" value={label.instagramUrl} />
          <ProfileField label="SoundCloud" value={label.soundcloudUrl} />
          <ProfileField label="Bandcamp" value={label.bandcampUrl} />
          <ProfileField label="Twitter" value={label.twitterUrl} />
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

        <Button label="Cerrar sesión" variant="secondary" onPress={() => setIsLogoutModalVisible(true)}/>
      
      </ScrollView>
          <NativeModal
            visible={isLogoutModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsLogoutModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                padding: spacing.lg,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <ConfirmationModal
                title="Cerrar sesión"
                confirmLabel="Confirmar"
                onClose={() => setIsLogoutModalVisible(false)}
                onCancel={() => setIsLogoutModalVisible(false)}
                onConfirm={() => {
                  setIsLogoutModalVisible(false);
                  logout();
                }}
              >
                <AppText variant="body-lg">
                  ¿Estás seguro de que querés cerrar sesión?
                </AppText>
              </ConfirmationModal>
            </View>
          </NativeModal>
    </SafeAreaView>
  );
}

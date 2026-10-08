import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Avatar } from '../../../components/atoms/Avatar';
import { Button } from '../../../components/atoms/Button';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { ProfileField } from '../../../components/molecules/ProfileField';
import { useLabelProfile } from '../../../features/label/useLabelProfile';
import { useAuthActions } from '../../../features/auth/info';

type LabelProfileStackParamList = {
  View: undefined;
  Edit: undefined;
};

/**
 * Placeholder — la pantalla real (lectura/edición de perfil label) sigue siendo trabajo del
 * Equipo 2. Acá ya está coordinado el botón "Editar" que navega al formulario de edición
 * (LabelProfileEditScreen).
 */
export function LabelProfileViewScreen() {
  const state = useLabelProfile();
  const { logout } = useAuthActions();
  const navigation = useNavigation<NativeStackNavigationProp<LabelProfileStackParamList>>();

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

        <Button label="Editar" variant="secondary" disabled onPress={() => {}} />
        <Button label="Cerrar sesión" variant="secondary" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}

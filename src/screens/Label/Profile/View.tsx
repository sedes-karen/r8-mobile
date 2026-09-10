import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
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
  const { logout } = useAuthActions();
  const navigation = useNavigation<NativeStackNavigationProp<LabelProfileStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'space-between' }}>
        <AppText variant="body-lg" color={colors.onSurface.variant}>
          Edite la pantalla LabelProfileViewScreen para cambiar esto
        </AppText>
        <View style={{ gap: spacing.md }}>
          <Button
            label="Editar"
            variant="secondary"
            onPress={() => navigation.navigate('Edit')}
          />
          <Button label="Cerrar sesión" variant="secondary" onPress={logout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

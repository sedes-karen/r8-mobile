import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { useAuthActions } from '../../../features/auth/info';

/**
 * Placeholder — la pantalla real (lectura/edición de perfil label) sigue siendo trabajo del
 * Equipo 2, no se construyó en este batch. Se le sumó el botón de logout para poder probar
 * entrar/salir sin recargar la app mientras se prueban las otras pantallas.
 */
export function LabelProfileViewScreen() {
  const { logout } = useAuthActions();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'space-between' }}>
        <AppText variant="body-lg" color={colors.onSurface.variant}>
          Edite la pantalla LabelProfileViewScreen para cambiar esto
        </AppText>
        <Button label="Cerrar sesión" variant="secondary" onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

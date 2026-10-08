import { View, Text } from 'react-native';
import { LinkButton } from '../../../components/atoms/LinkButton';
import { AppText } from '../../../components/atoms/AppText';

/**
 * Placeholder a la espera del detalle completo (reproductor + dismiss, Equipo 3). Ya tiene el
 * link al formulario de feedback para que esa pantalla sea alcanzable desde el player.
 */
export function ArtistPromosDetailsScreen({ route }: { route?: { params?: { promoId?: string } } }) {
  const promoId = route?.params?.promoId ?? '';

  return (
    <View style={{ flex: 1 }}>
      <Text>Edite la pantalla ArtistPromosDetailsScreen para cambiar esto</Text>
      <LinkButton screen="Feedback" params={{ promoId }}>
        <AppText variant="body-lg">Dar feedback</AppText>
      </LinkButton>
    </View>
  );
}

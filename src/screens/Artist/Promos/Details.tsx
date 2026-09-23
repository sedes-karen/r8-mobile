
import { View, StyleSheet, ScrollView } from 'react-native';
import type { StaticScreenProps } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { colors, spacing } from '../../../constants/design';
import { usePromoDetails } from '../../../features/promos/usePromoDetails';

type Props = StaticScreenProps<{ promoId: string }>;

export function ArtistPromosDetailsScreen({ route }: Props) {
  const { promoId } = route.params;

  const { promo, error } = usePromoDetails(promoId);

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!promo) {
    return <LoadingBlock label="Cargando promo..." />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText variant="headline-lg">
          Detalle de la promo
        </AppText>

        <View style={styles.card}>
          <AppText variant="title-md">
            Información de la promo
          </AppText>

          <AppText>ID: {promo.id}</AppText>
          <AppText>Estado: {promo.status}</AppText>
          <AppText>
            Activa: {promo.isActive ? 'Sí' : 'No'}
          </AppText>
          <AppText>
            Programada: {promo.scheduledAt ?? 'No definida'}
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant="title-md">
            Release asociado
          </AppText>

          <AppText variant="headline-lg">
            {promo.release.title}
          </AppText>

          <AppText>
            Artista: {promo.release.artistName ?? '—'}
          </AppText>

          <AppText>
            Label: {promo.release.labelName ?? '—'}
          </AppText>

          <AppText>
            Catálogo: {promo.release.catalogNumber ?? '—'}
          </AppText>

          <AppText>
            Tipo: {promo.release.type}
          </AppText>

          <AppText>
            Fecha de lanzamiento:{' '}
            {promo.release.releaseDate ?? '—'}
          </AppText>

          {promo.release.notes ? (
            <AppText>
              Notas: {promo.release.notes}
            </AppText>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface.default,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
});


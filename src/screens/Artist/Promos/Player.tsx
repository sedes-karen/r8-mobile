import { StyleSheet, View, FlatList } from 'react-native';

import { colors, spacing, borderRadius } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { useArtistPromos } from '../../../features/artist/useArtistPromos';
import { LinkButton } from '../../../components/atoms/LinkButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PromoInboxItem } from '../../../types/promo';

export function ArtistPromosPlayerScreen() {
  const state = useArtistPromos();

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando bandeja..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message="No se pudo cargar la bandeja." onRetry={state.reload} />;
  }

  const { inbox, pendingCount } = state.data || {};

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <AppText variant="headline-lg">Bandeja de promos</AppText>
        <LinkButton screen="LikedTracks" params={{}}>
          <AppText variant="body-lg" color={colors.primary.default}>
            Favoritos
          </AppText>
        </LinkButton>
      </View>

      {pendingCount > 0 ? (
        <View style={styles.pendingBanner}>
          <AppText variant="body-sm" color={colors.onSurface.default}>
            Tenés {pendingCount} promo{pendingCount === 1 ? '' : 's'} pendiente
            {pendingCount === 1 ? '' : 's'} de atención.
          </AppText>
        </View>
      ) : null}

      {!inbox?.length ? (
        <EmptyState message="No tenés promos en tu bandeja por ahora." />
      ) : (
        <FlatList
          data={inbox}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const renderItem = ({ item }: { item: PromoInboxItem }) => (
  <LinkButton
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    screen="Details"
    params={{ promoId: item.id }}
  >
    <View style={styles.cardHeader}>
      <AppText variant="title-md" numberOfLines={1}>
        {item.release.title}
      </AppText>
      {item.labelName ? (
        <AppText variant="body-sm" color={colors.onSurface.variant} numberOfLines={1}>
          {item.labelName}
        </AppText>
      ) : null}
    </View>
    <View style={styles.cardFooter}>
      {item.expiresAt ? (
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          Vence: {new Date(item.expiresAt).toLocaleDateString()}
        </AppText>
      ) : null}
      {item.status === 'SENT' && !item.hasFeedback ? (
        <View style={styles.pendingBadge}>
          <AppText variant="label-caps" color={colors.onSurface.default}>
            Pendiente
          </AppText>
        </View>
      ) : null}
    </View>
  </LinkButton>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  pendingBanner: {
    backgroundColor: colors.surface.default,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface.default,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  cardPressed: {
    backgroundColor: colors.surface.containerHigh,
  },
  cardHeader: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingBadge: {
    backgroundColor: colors.secondary.default,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
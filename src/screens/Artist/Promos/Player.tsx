import { useCallback, useEffect, useState } from 'react';
import { View, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, spacing, borderRadius } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { getPromosInbox, getPromosPendingCount } from '../../../services/api/promos';
import type { PromoInboxItem } from '../../../types/promo';

// ParamList menos de stack de promos del artista; hace que la navegación del
// componente Player quede tipada por el tipo de pantalla recibido como prop.
export type PromosStackParamList = {
  Player: undefined;
  Details: { promoId: string };
  LikedTracks: undefined;
};

interface PromoState {
  inbox: PromoInboxItem[];
  pendingCount: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: PromoState = {
  inbox: [],
  pendingCount: 0,
  loading: true,
  refreshing: false,
  error: null,
};

/** Decide si una promo debe marcarse pendiente de atención (sin feedback aún). */
function isPending(item: PromoInboxItem): boolean {
  return item.status === 'SENT' && !item.hasFeedback;
}

type PlayerProps = NativeStackScreenProps<PromosStackParamList, 'Player'>;

export function ArtistPromosPlayerScreen({ navigation }: PlayerProps) {
  const [state, setState] = useState<PromoState>(initialState);

  const load = useCallback(async (refresh = false) => {
    setState((prev) => ({ ...prev, error: null, loading: !refresh, refreshing: refresh }));
    try {
      const [inbox, pending] = await Promise.all([getPromosInbox(), getPromosPendingCount()]);
      setState({ inbox, pendingCount: pending.count, loading: false, refreshing: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la bandeja.';
      setState((prev) => ({ ...prev, loading: false, refreshing: false, error: message }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const renderItem = ({ item }: { item: PromoInboxItem }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => navigation.navigate('Details', { promoId: item.id })}
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
        {isPending(item) ? (
          <View style={styles.pendingBadge}>
            <AppText variant="label-caps" color={colors.onSurface.default}>
              Pendiente
            </AppText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <AppText variant="headline-lg">Bandeja de promos</AppText>
        {!state.loading ? (
          <Pressable onPress={() => navigation.navigate('LikedTracks')} accessibilityRole="button">
            <AppText variant="body-lg" color={colors.primary.default}>
              Mis favoritas
            </AppText>
          </Pressable>
        ) : null}
      </View>

      {state.pendingCount > 0 ? (
        <View style={styles.pendingBanner}>
          <AppText variant="body-sm" color={colors.onSurface.default}>
            Tenés {state.pendingCount} promo{state.pendingCount === 1 ? '' : 's'} pendiente
            {state.pendingCount === 1 ? '' : 's'} de atención.
          </AppText>
        </View>
      ) : null}

      {state.loading ? (
        <LoadingBlock label="Cargando bandeja..." />
      ) : state.error ? (
        <ErrorState message={state.error} onRetry={() => load()} />
      ) : state.inbox.length === 0 ? (
        <EmptyState message="No tenés promos en tu bandeja por ahora." />
      ) : (
        <FlatList
          data={state.inbox}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={state.refreshing} onRefresh={() => load(true)} tintColor={colors.primary.default} />
          }
        />
      )}
    </View>
  );
}

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
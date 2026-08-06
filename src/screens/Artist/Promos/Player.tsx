import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../../constants/design';
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
        <Text style={styles.releaseTitle} numberOfLines={1}>
          {item.release.title}
        </Text>
        {item.labelName ? (
          <Text style={styles.labelName} numberOfLines={1}>
            {item.labelName}
          </Text>
        ) : null}
      </View>
      <View style={styles.cardFooter}>
        {item.expiresAt ? (
          <Text style={styles.expires}>Vence: {new Date(item.expiresAt).toLocaleDateString()}</Text>
        ) : null}
        {isPending(item) ? (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Pendiente</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Bandeja de promos</Text>
        {!state.loading ? (
          <Pressable onPress={() => navigation.navigate('LikedTracks')} accessibilityRole="button">
            <Text style={styles.link}>Mis favoritas</Text>
          </Pressable>
        ) : null}
      </View>

      {state.pendingCount > 0 ? (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingBannerText}>
            Tenés {state.pendingCount} promo{state.pendingCount === 1 ? '' : 's'} pendiente
            {state.pendingCount === 1 ? '' : 's'} de atención.
          </Text>
        </View>
      ) : null}

      {state.loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : state.error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{state.error}</Text>
          <Pressable style={styles.retryButton} onPress={() => load()} accessibilityRole="button">
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : state.inbox.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No tenés promos en tu bandeja por ahora.</Text>
        </View>
      ) : (
        <FlatList
          data={state.inbox}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={state.refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
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
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  link: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  pendingBanner: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
  },
  pendingBannerText: {
    color: colors.primaryDark,
    fontSize: fontSizes.sm,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutralLight,
  },
  cardPressed: {
    backgroundColor: colors.neutralLight,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  releaseTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  labelName: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expires: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  pendingBadge: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pendingText: {
    color: colors.onSecondary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.onPrimary,
    fontWeight: fontWeights.semibold,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
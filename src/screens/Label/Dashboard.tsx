import {View, StyleSheet, FlatList, ActivityIndicator, Button,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { Card } from '../../components/molecules/Card';
import { AppText } from '../../components/atoms/AppText';
import { useReleases } from '../../features/releases/useReleases';
import { colors, spacing } from '../../constants/design';
import type { ReleaseListItem } from '../../types/releases/release';

export function LabelDashboardScreen() {
  const { state, reload } = useReleases();

  const releases =
    state.status === 'success'
      ? state.data
      : [];

  function formatSubtitle(item: ReleaseListItem) {
    const year = item.releaseDate.slice(0, 4);
    return `${item.type} · ${year}`;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <ScreenTitle
          title="Dashboard"
          subtitle="Catálogo del label"
        />
      </View>

      {state.status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <AppText
            variant="body"
            style={styles.loadingText}
          >
            Cargando catálogo...
          </AppText>
        </View>
      )}

      {state.status === 'error' && (
        <View style={styles.center}>
          <AppText
            variant="body"
            style={styles.errorText}
          >
            {state.message}
          </AppText>

          <Button
            title="Reintentar"
            onPress={reload}
            color={colors.primary}
          />
        </View>
      )}

      {state.status === 'empty' && (
        <View style={styles.center}>
          <AppText variant="body">
            No hay lanzamientos cargados en este label.
          </AppText>
        </View>
      )}

      {state.status === 'success' && (
        <FlatList
          data={releases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card
              title={`${item.title} — ${item.artist}`}
              subtitle={formatSubtitle(item)}
              onPress={() => {
                console.log('Navegar al release:', item.id);
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },

  list: {
    padding: spacing.md,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  loadingText: {
    marginTop: spacing.sm,
  },

  errorText: {
    color: colors.error,
    marginBottom: spacing.sm,
  },
});
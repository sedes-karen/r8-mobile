import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../../components/atoms/AppText';
import { LoadingBlock } from '../../components/atoms/LoadingBlock';
import { ErrorState } from '../../components/molecules/ErrorState';
import { EmptyState } from '../../components/molecules/EmptyState';
import { Card } from '../../components/molecules/Card';
import { useReleases } from '../../features/releases/useReleases';
import { colors, spacing } from '../../constants/design';
import type { ReleaseListItem } from '../../types/releases/release';

function formatSubtitle(item: ReleaseListItem) {
  const year = item.releaseDate.slice(0, 4);
  return `${item.type} · ${year}`;
}

export function LabelDashboardScreen() {
  const result = useReleases();
  const navigation = useNavigation();

  if (result.status === 'loading') {
    return <LoadingBlock label="Cargando catálogo..." />;
  }

  if (result.status === 'error') {
    return <ErrorState message={result.message} onRetry={result.reload} />;
  }

  const releases = result.data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <AppText variant="headline-lg">Dashboard</AppText>
        <AppText variant="body-sm" color={colors.onSurface.variant} style={{ marginTop: spacing.xs }}>
          Catálogo del label
        </AppText>
      </View>

      {releases.length === 0 ? (
        <EmptyState message="No hay lanzamientos cargados en este label." />
      ) : (
        <FlatList
          data={releases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg }}
          renderItem={({ item }) => (
            <Card
              title={`${item.title} — ${item.artist}`}
              subtitle={formatSubtitle(item)}
              onPress={() =>
                (navigation.navigate as any)('Releases', {
                  screen: 'Details',
                  params: { releaseId: item.id },
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

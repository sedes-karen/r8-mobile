import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/atoms/AppText";
import { LoadingBlock } from "../../components/atoms/LoadingBlock";
import { EmptyState } from "../../components/molecules/EmptyState";
import { ErrorState } from "../../components/molecules/ErrorState";
import { PromoRow } from "../../components/molecules/PromoRow";
import { SearchField } from "../../components/molecules/SearchField";
import { colors, spacing } from "../../constants/design";
import { useAuthUser } from "../../features/auth/info";
import { usePromosForLabel } from "../../features/promos/usePromosForLabel";

export function LabelDashboardScreen() {
  const user = useAuthUser();
  const state = usePromosForLabel();
  const [search, setSearch] = useState("");

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando estadísticas..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  const labelName = user?.labels?.[0]?.name;
  const recentPromos = state.data.slice(0, 5);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPromos = recentPromos.filter((promo) =>
    promo.release.title.toLowerCase().includes(normalizedSearch),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View>
          <AppText variant="headline-lg">
            {labelName ? `Hola, ${labelName}` : 'Hola'}
          </AppText>
        
          {user?.email ? (
            <AppText variant="body-sm" style={{ marginTop: spacing.sm }}>
              {user.email}
            </AppText>
          ) : null}
        
        </View>

        <View>
          <AppText variant="title-md" style={{ marginBottom: spacing.sm }}>
            Promos recientes
          </AppText>

          {state.data.length === 0 ? (
            <EmptyState message="Todavía no hay promos para mostrar." />
          ) : (
            <>
              <SearchField
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar por lanzamiento..."
                accessibilityLabel="Buscar promos recientes"
              />
              {filteredPromos.length === 0 ? (
                <EmptyState message="No hay promos recientes que coincidan con la búsqueda." />
              ) : (
                filteredPromos.map((promo) => <PromoRow key={promo.id} promo={promo} />)
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

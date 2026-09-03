import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { ListRowCard } from '../../components/molecules/ListRowCard';
import { spacing } from '../../design/tokens/spacing';
import { colors } from '../../design/tokens/colors';

const PLACEHOLDER_RELEASES = [
    { title: 'EP Demo — Artista X', subtitle: 'EP · 2026' },
    { title: 'Album Demo — Artista Y', subtitle: 'ALBUM · 2025' },
];

export function ReleasesListScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <ScreenTitle
                    title="Releases"
                    subtitle="Equipo 4 — Catálogo (mock)"
                />
                {PLACEHOLDER_RELEASES.map((item) => (
                    <ListRowCard
                        key={item.title}
                        title={item.title}
                        subtitle={item.subtitle}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
});
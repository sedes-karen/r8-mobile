import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { MetaDataRow } from '../../../components/molecules/MetaDataRow';

// TODO(releases): reemplazar este mock por datos reales cuando se mergee
// useReleaseDetail (rama feature/release-detail-hook) + fetchReleaseById
// (rama feature/releases-api, OJO: corregir los enums de esa rama antes de
// usarla — ver charla del equipo, type/status no coinciden con la API real).
// La forma de este objeto ya sigue el tipo ReleaseDetail acordado, así que
// el swap debería ser solo cambiar esta constante por el `data` del hook.
const MOCK_RELEASE = {
  title: 'EP Demo',
  artist: 'Artista X',
  type: 'EP',
  releaseDate: '2026-05-01',
  catalogNumber: 'R8-001',
  status: 'CREATED',
  tracks: [
    { id: '1', title: 'Intro Demo', trackNumber: 1, duration: 183 },
    { id: '2', title: 'Main Mix', trackNumber: 2, duration: 326 },
  ],
};

export function LabelReleasesDetailsScreen() {
  const release = MOCK_RELEASE;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">{release.title}</AppText>

        <View>
          <MetaDataRow label="Artista" value={release.artist} />
          <MetaDataRow label="Tipo" value={release.type} />
          <MetaDataRow label="Fecha" value={new Date(release.releaseDate).toLocaleDateString()} />
          <MetaDataRow label="Catálogo" value={release.catalogNumber} />
          <MetaDataRow label="Estado" value={release.status} />
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="title-md">Tracks</AppText>
          {release.tracks.map((track) => (
            <View
              key={track.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: spacing.xs,
                borderBottomWidth: 1,
                borderBottomColor: colors.surface.border,
              }}
            >
              <AppText variant="body-lg">{track.trackNumber}. {track.title}</AppText>
              <AppText variant="body-sm" color={colors.onSurface.variant}>
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

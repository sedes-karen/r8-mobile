import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';

import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { Button } from '../../../components/atoms/Button';
import { LinkButton } from '../../../components/atoms/LinkButton';

import { getPromoDetail, getReleaseWithTracks, dismissPromo } from '../../../services/api/promoDetailApi';
import type { PromoDetail } from '../../../types/promos/detail';
import type { ReleaseDetail } from '../../../types/releases';

// --- Estado ---

type DetailsState = {
  promo: PromoDetail | null;
  release: ReleaseDetail | null;
  loading: boolean;
  error: string | null;
  dismissing: boolean;
  currentTrackIndex: number;
  isPlaying: boolean;
};

const initialState: DetailsState = {
  promo: null,
  release: null,
  loading: true,
  error: null,
  dismissing: false,
  currentTrackIndex: 0,
  isPlaying: false,
};

// --- Utilidades ---

function formatDuration(seconds: number | null): string {
  if (seconds === null) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// --- Pantalla ---

export function ArtistPromosDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { promoId } = route.params as { promoId: string };

  const [state, setState] = useState<DetailsState>(initialState);

  const currentTrack = state.release?.tracks[state.currentTrackIndex] ?? null;
  const player = useAudioPlayer(
    currentTrack?.audioUrl ? { uri: currentTrack.audioUrl } : null
  );

  useEffect(() => {
    return () => { player.remove(); };
  }, [player]);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const promo = await getPromoDetail(promoId);
      const release = await getReleaseWithTracks(promo.release.id);
      release.tracks.sort((a, b) => a.trackNumber - b.trackNumber);
      setState((prev) => ({ ...prev, promo, release, loading: false, error: null, dismissing: false }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la promo.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [promoId]);

  useEffect(() => { load(); }, [load]);

  // --- Handlers ---

  function handleDismiss() {
    Alert.alert(
      '¿Descartar esta promo?',
      'La promo dejará de aparecer en tu bandeja.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: async () => {
            setState((prev) => ({ ...prev, dismissing: true }));
            try {
              await dismissPromo(promoId);
              navigation.goBack();
            } catch (err) {
              const message = err instanceof Error ? err.message : 'No se pudo descartar.';
              Alert.alert('Error', message);
              setState((prev) => ({ ...prev, dismissing: false }));
            }
          },
        },
      ]
    );
  }

  function playOrPause() {
    if (player.playing) {
      player.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      player.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  }

  function goToNextTrack() {
    const total = state.release?.tracks.length ?? 0;
    setState((prev) => ({
      ...prev,
      currentTrackIndex: Math.min(prev.currentTrackIndex + 1, total - 1),
      isPlaying: false,
    }));
  }

  function goToPrevTrack() {
    setState((prev) => ({
      ...prev,
      currentTrackIndex: Math.max(prev.currentTrackIndex - 1, 0),
      isPlaying: false,
    }));
  }

  // --- Renders condicionales ---

  if (state.loading) {
    return <LoadingBlock label="Cargando promo..." />;
  }

  if (state.error || !state.promo || !state.release) {
    return <ErrorState message={state.error ?? 'Error desconocido'} onRetry={load} />;
  }

  const { promo, release } = state;
  const isInactive = !promo.isActive || promo.status === 'EXPIRED';

  // --- Render principal ---

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Cabecera: título, artista, catálogo y aviso si la promo vencio */}
        <View style={styles.headerBlock}>
          <AppText variant="headline-lg">{release.title}</AppText>
          {release.artist ? (
            <AppText variant="body-sm">{release.artist}</AppText>
          ) : null}
          {promo.release.catalogNumber ? (
            <AppText variant="body-sm" color={colors.onSurface.variant}>
              Catálogo: {promo.release.catalogNumber}
            </AppText>
          ) : null}
          {isInactive ? (
            <View style={styles.inactiveBanner}>
              <AppText variant="label-caps" color={colors.error.default}>
                Esta promo ya no está activa
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Lista de pistas — tocar una fila la carga en el reproductor */}
        <View style={styles.tracksBlock}>
          <AppText variant="title-md" style={styles.tracksTitle}>Pistas</AppText>
          {release.tracks.map((track, index) => {
            const isActive = state.currentTrackIndex === index;
            return (
              <Pressable
                key={track.id}
                onPress={() => setState((prev) => ({ ...prev, currentTrackIndex: index, isPlaying: false }))}
                style={[styles.trackRow, isActive && styles.trackRowActive]}
              >
                <AppText variant="body-sm" color={colors.onSurface.variant}>
                  {track.trackNumber}.
                </AppText>
                <AppText variant="body-lg" style={{ flex: 1 }}>
                  {track.title}
                </AppText>
                <AppText variant="body-sm" color={colors.onSurface.variant}>
                  {formatDuration(track.duration)}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* Reproductor: info de pista activa + controles */}
        <View style={styles.playerContainer}>
          <View style={styles.playerInfo}>
            <AppText variant="body-lg" numberOfLines={1}>
              {currentTrack?.title ?? '---'}
            </AppText>
            <AppText variant="body-sm" color={colors.onSurface.variant}>
              Pista {state.currentTrackIndex + 1} de {release.tracks.length}
            </AppText>
            {!currentTrack?.audioUrl ? (
              <AppText variant="label-micro" color={colors.error.default}>
                Audio no disponible
              </AppText>
            ) : null}
          </View>
          <View style={styles.playerControls}>
            <Button
              label="Ant."
              variant="secondary"
              disabled={state.currentTrackIndex === 0}
              onPress={goToPrevTrack}
            />
            <Button
              label={state.isPlaying ? 'Pausa' : 'Play'}
              variant="primary"
              disabled={!currentTrack?.audioUrl}
              onPress={playOrPause}
            />
            <Button
              label="Sig."
              variant="secondary"
              disabled={state.currentTrackIndex === release.tracks.length - 1}
              onPress={goToNextTrack}
            />
          </View>
        </View>

        {/* Acciones de la promo: feedback y descarte */}
        <View style={styles.actionsBlock}>
          <LinkButton screen="Feedback" params={{ promoId }}>
            <Button
              label="Enviar feedback"
              variant="primary"
              disabled={state.dismissing || isInactive}
            />
          </LinkButton>
          <Button
            label="Descartar promo"
            variant="secondary"
            loading={state.dismissing}
            onPress={handleDismiss}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  headerBlock: {
    gap: spacing.xs,
  },
  inactiveBanner: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error.container,
    backgroundColor: 'rgba(147, 0, 10, 0.1)',
  },
  tracksBlock: {
    gap: spacing.sm,
  },
  tracksTitle: {
    marginBottom: spacing.xs,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  trackRowActive: {
    backgroundColor: colors.surface.containerHigh,
  },
  playerContainer: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surface.border,
    gap: spacing.sm,
  },
  playerInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actionsBlock: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});

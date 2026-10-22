import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';

import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { Button } from '../../../components/atoms/Button';
import { LinkButton } from '../../../components/atoms/LinkButton';
import { Modal } from '../../../components/molecules/Modal';
import { PromoTrackRow } from '../../../components/molecules/PromoTrackRow';

import { getPromoDetail, getReleaseWithTracks, dismissPromo } from '../../../services/api/promoDetailApi';
import type { PromoDetail } from '../../../types/promos/detail';
import type { ReleaseDetail } from '../../../types/releases/releaseDetail';

// --- Categoría: Tipos y Estado ---

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

// --- Categoría: Componente Principal ---

export function ArtistPromosDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { promoId } = route.params as { promoId: string };

  const [state, setState] = useState<DetailsState>(initialState);
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);

  const currentTrack = state.release?.tracks[state.currentTrackIndex] ?? null;
  const player = useAudioPlayer(
    currentTrack?.audioUrl ? { uri: currentTrack.audioUrl } : null
  );

  useEffect(() => {
    return () => {
      player.remove();
    };
  }, [player]);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const promo = await getPromoDetail(promoId);
      const release = await getReleaseWithTracks(promo.release.id);
      release.tracks.sort((a, b) => a.trackNumber - b.trackNumber);
      setState((prev) => ({
        ...prev,
        promo,
        release,
        loading: false,
        error: null,
        dismissing: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la promo.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [promoId]);

  useEffect(() => {
    load();
  }, [load]);

  // --- Categoría: Handlers de Acciones ---

  async function handleConfirmDismiss() {
    setState((prev) => ({ ...prev, dismissing: true }));
    try {
      await dismissPromo(promoId);
      setIsDismissModalOpen(false);
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo descartar.';
      Alert.alert('Error', message);
      setState((prev) => ({ ...prev, dismissing: false }));
    }
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

  function toggleLike(trackId: string) {
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  }

  function handleLikeAll() {
    if (!state.release) return;
    const allIds = state.release.tracks.map((t) => t.id);
    const areAllLiked = allIds.every((id) => likedTrackIds.includes(id));
    setLikedTrackIds(areAllLiked ? [] : allIds);
  }

  function handleDownloadAll() {
    // Punto de integración para descarga por lote
  }

  // --- Categoría: Renders Condicionales de Carga y Error ---

  if (state.loading) {
    return <LoadingBlock label="Cargando promo..." />;
  }

  if (state.error || !state.promo || !state.release) {
    return <ErrorState message={state.error ?? 'Error desconocido'} onRetry={load} />;
  }

  const { promo, release } = state;
  const isInactive = !promo.isActive || promo.status === 'EXPIRED';
  const coverUrl = promo.release.artwork ?? release.coverUrl;
  const releaseNotes = release.notes ?? promo.release.notes;

  // --- Categoría: Render Principal ---

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Cabecera: Portada, Metadatos y Botones de acción superior */}
        <View style={styles.headerBlock}>
          <View style={styles.headerTopRow}>
            {coverUrl ? (
              <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.coverPlaceholder}>
                <AppText variant="headline-lg">🎵</AppText>
              </View>
            )}

            <View style={styles.headerInfo}>
              <AppText variant="headline-lg" numberOfLines={2}>
                {release.title}
              </AppText>
              {release.artist ? (
                <AppText variant="body-lg" color={colors.onSurface.default}>
                  {release.artist}
                </AppText>
              ) : null}
              {promo.release.labelName ? (
                <AppText variant="body-sm" color={colors.onSurface.variant}>
                  Label: {promo.release.labelName}
                </AppText>
              ) : null}
              {promo.release.catalogNumber ? (
                <AppText variant="body-sm" color={colors.onSurface.variant}>
                  Catálogo: {promo.release.catalogNumber}
                </AppText>
              ) : null}
            </View>

            <View style={styles.headerActions}>
              <LinkButton screen="Feedback" params={{ promoId }}>
                <View style={styles.iconButton}>
                  <AppText variant="title-md">💬</AppText>
                </View>
              </LinkButton>
              <Pressable
                onPress={() => setIsDismissModalOpen(true)}
                style={styles.iconButton}
                disabled={state.dismissing}
                hitSlop={8}
              >
                <AppText variant="title-md">🗑️</AppText>
              </Pressable>
            </View>
          </View>

          {/* Aviso si la promo venció o está inactiva */}
          {isInactive ? (
            <View style={styles.inactiveBanner}>
              <AppText variant="label-caps" color={colors.error.default}>
                Esta promo ya no está activa
              </AppText>
            </View>
          ) : null}

          {/* Notas del release: desaparece si no hay notas */}
          {releaseNotes ? (
            <View style={styles.notesBlock}>
              <AppText variant="body-sm" color={colors.onSurface.variant}>
                Notas: {releaseNotes}
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Acciones en lote */}
        <View style={styles.batchActionsRow}>
          <Button
            label="Favorito a todos"
            variant="secondary"
            onPress={handleLikeAll}
          />
          <Button
            label="Descarga todo"
            variant="secondary"
            onPress={handleDownloadAll}
          />
        </View>

        {/* Lista de pistas */}
        <View style={styles.tracksBlock}>
          <AppText variant="title-md" style={styles.tracksTitle}>
            Pistas ({release.tracks.length})
          </AppText>
          {release.tracks.map((track, index) => {
            const isActive = state.currentTrackIndex === index;
            const isLiked = likedTrackIds.includes(track.id);
            return (
              <PromoTrackRow
                key={track.id}
                trackNumber={track.trackNumber}
                title={track.title}
                duration={track.duration}
                isActive={isActive}
                isLiked={isLiked}
                onSelectTrack={() =>
                  setState((prev) => ({ ...prev, currentTrackIndex: index, isPlaying: false }))
                }
                onToggleLike={() => toggleLike(track.id)}
                onDownload={() => {}}
              />
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

      </ScrollView>

      {/* Modal de confirmación de descarte */}
      {isDismissModalOpen ? (
        <View style={styles.modalOverlay}>
          <Modal
            title="¿Descartar esta promo?"
            onClose={() => setIsDismissModalOpen(false)}
            onCancel={() => setIsDismissModalOpen(false)}
            onConfirm={handleConfirmDismiss}
            confirmLabel={state.dismissing ? 'Descartando...' : 'Descartar'}
          >
            <AppText variant="body-sm" color={colors.onSurface.variant}>
              La promo dejará de aparecer en tu bandeja de entrada.
            </AppText>
          </Modal>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

// --- Categoría: Estilos ---

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
    gap: spacing.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  coverImage: {
    width: 90,
    height: 90,
    borderRadius: 4,
    backgroundColor: colors.surface.containerLow,
  },
  coverPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 4,
    backgroundColor: colors.surface.containerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.xs,
    backgroundColor: colors.surface.containerHigh,
    borderRadius: 4,
  },
  notesBlock: {
    padding: spacing.sm,
    backgroundColor: colors.surface.containerLow,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.default,
  },
  inactiveBanner: {
    marginTop: spacing.xs,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error.container,
    backgroundColor: 'rgba(147, 0, 10, 0.1)',
  },
  batchActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tracksBlock: {
    gap: spacing.sm,
  },
  tracksTitle: {
    marginBottom: spacing.xs,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
});

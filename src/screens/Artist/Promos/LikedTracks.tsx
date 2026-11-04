import { useState } from 'react';
import { Modal as RNModal, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { Modal } from '../../../components/molecules/Modal';
import { ReleaseTracksGroup } from '../../../components/organisms/ReleaseTracksGroup';
import { useLikedTracks } from '../../../features/feedback/useLikedTracks';

/** Liked Tracks (Equipo 3) — lectura + el único write de este batch (quitar de favoritos). */
export function ArtistPromosLikedTracksScreen() {
  const { status, message, items, unlikeError, removingTrackId, unlikeTrack, reload } = useLikedTracks();

  const [trackToRemove, setTrackToRemove] = useState<{
    releaseId: string;
    feedbackId: string;
    trackId: string;
  } | null>(null);

  const handleConfirmUnlike = () => {
    if (!trackToRemove) return;

    void unlikeTrack(
      trackToRemove.releaseId,
      trackToRemove.feedbackId,
      trackToRemove.trackId,
    );

    setTrackToRemove(null);
  };
  
  if (status === 'loading') {
    return <LoadingBlock label="Cargando favoritos..." />;
  }

  if (status === 'error') {
    return <ErrorState message={message ?? 'No se pudieron cargar los tracks favoritos'} onRetry={reload} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Favoritos</AppText>
        {unlikeError ? <ErrorMessage message={unlikeError} /> : null}

        {items.length === 0 ? (
          <EmptyState message="Todavía no marcaste ningún track como favorito." />
        ) : (
          items.map((release) => (
            <ReleaseTracksGroup
              key={release.releaseId}
              release={release}
              removingTrackId={removingTrackId}
              onUnlikeTrack={(trackId) =>
                setTrackToRemove({
                  releaseId: release.releaseId,
                  feedbackId: release.feedbackId,
                  trackId,
                })
              }
            />
          ))
        )}
      </ScrollView>
            <RNModal
        visible={trackToRemove !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTrackToRemove(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
        >
          <Modal
            title="Quitar de favoritos"
            onClose={() => setTrackToRemove(null)}
            onCancel={() => setTrackToRemove(null)}
            onConfirm={handleConfirmUnlike}
            confirmLabel="Quitar"
          >
            <AppText variant="body-sm">
              ¿Estás seguro de que querés quitar este tema de tus favoritos?
            </AppText>
          </Modal>
        </View>
      </RNModal>
    </SafeAreaView>
  );
}
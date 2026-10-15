import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type StaticScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import {
  ReleaseForm,
  type ReleaseFormErrors,
} from '../../../components/organisms/ReleaseForm';
import { useAsyncData } from '../../../hooks/useAsyncData';
import { useUpdateRelease } from '../../../features/releases/useUpdateRelease';
import { fetchReleaseById } from '../../../services/api/releasesApi';
import type { ReleaseType, UpdateReleaseBody } from '../../../types/releases';

type LabelReleasesStackParamList = {
  Edit: { releaseId: string };
};

type LabelReleasesEditScreenProps = StaticScreenProps<{ releaseId: string }>;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Edición de los datos básicos de un release: precarga, valida localmente y hace el PATCH. */
export function LabelReleasesEditScreen({ route }: LabelReleasesEditScreenProps) {
  const { releaseId } = route.params;
  const state = useAsyncData(() => fetchReleaseById(releaseId));
  const { submit: saveRelease, loading: saving, error: saveError } =
    useUpdateRelease(releaseId);
  const navigation = useNavigation<NativeStackNavigationProp<LabelReleasesStackParamList>>();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [type, setType] = useState<ReleaseType>('EP');
  const [releaseDate, setReleaseDate] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ReleaseFormErrors>({});
  const [seeded, setSeeded] = useState(false);
  const [saved, setSaved] = useState(false);

  const release = state.status === 'success' ? state.data : null;

  // Precarga una sola vez por release: si el usuario reload-ea, no pisa lo que ya escribió.
  useEffect(() => {
    if (!release || seeded) return;
    setTitle(release.title);
    setArtist(release.artist);
    setType(release.type);
    setReleaseDate(release.releaseDate);
    setSeeded(true);
  }, [release, seeded]);

  // Éxito: confirmación inline un instante y luego vuelta atrás (mismo criterio que Profile/Edit).
  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => navigation.goBack(), 1200);
    return () => clearTimeout(timeout);
  }, [saved, navigation]);

  if (state.status === 'loading') {
    return <LoadingBlock label="Cargando release..." />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={state.reload} />;
  }

  // Todavía no se sembraron los campos desde el release: evita un flash de formulario vacío.
  if (!seeded) {
    return <LoadingBlock label="Cargando release..." />;
  }

  function validate(): ReleaseFormErrors {
    const errors: ReleaseFormErrors = {};
    if (!title.trim()) errors.title = 'El título es obligatorio';
    if (!artist.trim()) errors.artist = 'El artista es obligatorio';
    if (releaseDate.trim() && !DATE_PATTERN.test(releaseDate.trim())) {
      errors.releaseDate = 'Formato inválido (YYYY-MM-DD)';
    }
    return errors;
  }

  async function handleSave() {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const body: UpdateReleaseBody = {
      title: title.trim(),
      artist: artist.trim(),
      type,
    };
    const trimmedDate = releaseDate.trim();
    if (trimmedDate) body.releaseDate = trimmedDate;

    const ok = await saveRelease(body);
    if (ok) setSaved(true);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Editar release</AppText>
        <ReleaseForm
          title={title}
          artist={artist}
          type={type}
          releaseDate={releaseDate}
          onChangeTitle={setTitle}
          onChangeArtist={setArtist}
          onChangeType={setType}
          onChangeReleaseDate={setReleaseDate}
          onSubmit={handleSave}
          loading={saving}
          errors={fieldErrors}
          errorMessage={saveError ?? undefined}
          successMessage={saved ? 'Cambios guardados' : undefined}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

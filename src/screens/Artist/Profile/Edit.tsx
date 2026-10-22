import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LoadingBlock } from '../../../components/atoms/LoadingBlock';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { LabeledInput } from '../../../components/molecules/LabeledInput';
import { SuccessNotice } from '../../../components/molecules/SuccessNotice';
import { useArtistProfile } from '../../../features/artist/useArtistProfile';
import { useUpdateArtistProfile } from '../../../features/artist/useUpdateArtistProfile';
import type { ArtistProfile, UpdateArtistProfileInput } from '../../../types/artist';

/** Tope de la biografía: es regla de la pantalla, el contrato de la API no lo fija. */
const BIO_MAX_LENGTH = 300;

type FormValues = {
  firstName: string;
  lastName: string;
  artistName: string;
  bio: string;
  instagramUrl: string;
  soundcloudUrl: string;
  bandcampUrl: string;
  twitterUrl: string;
};

type FieldErrors = Partial<Pick<FormValues, 'artistName' | 'bio'>>;

const EMPTY_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  artistName: '',
  bio: '',
  instagramUrl: '',
  soundcloudUrl: '',
  bandcampUrl: '',
  twitterUrl: '',
};

const trimmed = (value: string): string => value.trim();

function toFormValues(artist: ArtistProfile): FormValues {
  return {
    firstName: artist.firstName,
    lastName: artist.lastName,
    artistName: artist.artistName ?? '',
    bio: artist.bio ?? '',
    instagramUrl: artist.instagramUrl ?? '',
    soundcloudUrl: artist.soundcloudUrl ?? '',
    bandcampUrl: artist.bandcampUrl ?? '',
    twitterUrl: artist.twitterUrl ?? '',
  };
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!trimmed(values.artistName)) errors.artistName = 'El nombre artístico es obligatorio.';
  if (values.bio.length > BIO_MAX_LENGTH) {
    errors.bio = `La biografía puede tener hasta ${BIO_MAX_LENGTH} caracteres.`;
  }
  return errors;
}

/**
 * Los nombres se envían en camelCase al servicio, que los adapta al DTO HTTP.
 * Se conserva el envío de null para campos vacíos; su efecto en el PUT requiere validación con backend.
 */
function toInput(values: FormValues): UpdateArtistProfileInput {
  return {
    firstName: trimmed(values.firstName) || undefined,
    lastName: trimmed(values.lastName) || undefined,
    artistName: trimmed(values.artistName),
    bio: trimmed(values.bio) || null,
    instagramUrl: trimmed(values.instagramUrl) || null,
    soundcloudUrl: trimmed(values.soundcloudUrl) || null,
    bandcampUrl: trimmed(values.bandcampUrl) || null,
    twitterUrl: trimmed(values.twitterUrl) || null,
  };
}

/** Edición del perfil del artista autenticado — GET /artists/me para cargar, PUT para guardar. */
export function ArtistProfileEditScreen() {
  const profile = useArtistProfile();
  const { submit: saveProfile, loading: saving, error: saveError } = useUpdateArtistProfile();

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState(false);

  // El GET responde después del primer render: el formulario se puebla recién cuando llega.
  const artist = profile.status === 'success' ? profile.data : null;
  useEffect(() => {
    if (artist) setValues(toFormValues(artist));
  }, [artist]);

  if (profile.status === 'loading') {
    return <LoadingBlock label="Cargando perfil..." />;
  }

  if (profile.status === 'error') {
    return <ErrorState message={profile.message} onRetry={profile.reload} />;
  }

  const setField = (field: keyof FormValues, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  /** Agrupa lo que repiten los 8 inputs para que cada LabeledInput entre en una línea. */
  const fieldProps = (field: keyof FormValues) => ({
    value: values[field],
    onChangeText: (value: string) => setField(field, value),
    editable: !saving,
  });

  const handleSubmit = async () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaved(false);
    setSaved(await saveProfile(toInput(values)));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText variant="headline-lg">Editar perfil</AppText>

        <AppText variant="title-md">Nombre artístico</AppText>
        <LabeledInput label="Nombre artístico *" {...fieldProps('artistName')} error={errors.artistName} />

        <AppText variant="title-md">Datos personales</AppText>
        <LabeledInput label="Nombre" {...fieldProps('firstName')} />
        <LabeledInput label="Apellido" {...fieldProps('lastName')} />

        <AppText variant="title-md">Biografía</AppText>
        <LabeledInput
          label="Biografía"
          {...fieldProps('bio')}
          error={errors.bio}
          multiline
          style={{ minHeight: 96, textAlignVertical: 'top' }}
        />
        <AppText variant="label-micro" color={colors.onSurface.variant}>
          {`${values.bio.length}/${BIO_MAX_LENGTH}`}
        </AppText>

        <AppText variant="title-md">Redes sociales</AppText>
        <LabeledInput label="Instagram" {...fieldProps('instagramUrl')} autoCapitalize="none" />
        <LabeledInput label="SoundCloud" {...fieldProps('soundcloudUrl')} autoCapitalize="none" />
        <LabeledInput label="Bandcamp" {...fieldProps('bandcampUrl')} autoCapitalize="none" />
        <LabeledInput label="Twitter" {...fieldProps('twitterUrl')} autoCapitalize="none" />

        {saveError ? <ErrorMessage message={saveError} /> : null}
        {saved ? <SuccessNotice title="Cambios guardados" /> : null}
        <Button label="Guardar cambios" onPress={handleSubmit} loading={saving} disabled={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg },
});

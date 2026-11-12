import { StyleSheet, View } from 'react-native';
import { spacing } from '../../constants/design';
import type { ReleaseType } from '../../types/releases';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';
import { ReleaseTypeSelector } from '../molecules/ReleaseTypeSelector';
import { SuccessNotice } from '../molecules/SuccessNotice';

const RELEASE_TYPES: readonly ReleaseType[] = ['EP', 'VA', 'ALBUM'];

export type ReleaseFormErrors = {
  title?: string;
  artist?: string;
  releaseDate?: string;
};

type ReleaseFormProps = {
  title: string;
  artist: string;
  type: ReleaseType;
  releaseDate: string;
  onChangeTitle: (value: string) => void;
  onChangeArtist: (value: string) => void;
  onChangeType: (value: ReleaseType) => void;
  onChangeReleaseDate: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  errors?: ReleaseFormErrors;
  errorMessage?: string;
  successMessage?: string;
};

/**
 * Formulario de release (título, artista, tipo, fecha) solo con props — la pantalla valida y
 * decide qué hacer al enviar. Compartido por New y Edit.
 */
export function ReleaseForm({
  title,
  artist,
  type,
  releaseDate,
  onChangeTitle,
  onChangeArtist,
  onChangeType,
  onChangeReleaseDate,
  onSubmit,
  loading = false,
  disabled = false,
  submitLabel = 'Guardar cambios',
  errors,
  errorMessage,
  successMessage,
}: ReleaseFormProps) {
  return (
    <View style={styles.form}>
      <LabeledInput
        label="Título"
        accessibilityLabel="Título del release"
        value={title}
        onChangeText={onChangeTitle}
        error={errors?.title}
        editable={!loading}
      />
      <LabeledInput
        label="Artista"
        accessibilityLabel="Artista del release"
        value={artist}
        onChangeText={onChangeArtist}
        error={errors?.artist}
        editable={!loading}
      />
      <ReleaseTypeSelector
        label="Tipo"
        options={RELEASE_TYPES}
        value={type}
        onChange={onChangeType}
        disabled={loading}
      />
      <LabeledInput
        label="Fecha de release"
        accessibilityLabel="Fecha de release"
        value={releaseDate}
        onChangeText={onChangeReleaseDate}
        error={errors?.releaseDate}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      {successMessage ? <SuccessNotice title={successMessage} /> : null}
      <Button
        label={submitLabel}
        onPress={onSubmit}
        loading={loading}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
});

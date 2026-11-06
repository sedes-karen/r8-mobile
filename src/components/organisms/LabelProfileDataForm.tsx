import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../constants/design';
import type { LabelProfile, UpdateLabelProfileInput } from '../../types/label';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';
import { SuccessNotice } from '../molecules/SuccessNotice';

export type LabelProfileFormInitial = Pick<
  LabelProfile,
  'name' | 'description' | 'instagramUrl' | 'soundcloudUrl' | 'bandcampUrl' | 'twitterUrl'
>;

type Props = {
  initial: LabelProfileFormInitial;
  onSubmit: (input: UpdateLabelProfileInput) => Promise<boolean>;
  saving: boolean;
  errorMessage: string | null;
};

export type LabelProfileFormValues = {
  name: string;
  description: string;
  instagramUrl: string;
  soundcloudUrl: string;
  bandcampUrl: string;
  twitterUrl: string;
};

export type LabelProfileFormField = keyof LabelProfileFormValues;

export type LabelProfileFormErrors = Partial<Record<LabelProfileFormField, string>>;

const URL_FIELDS: ReadonlyArray<LabelProfileFormField> = [
  'instagramUrl',
  'soundcloudUrl',
  'bandcampUrl',
  'twitterUrl',
];

const URL_PATTERN = /^https?:\/\/[^\s/$.?#][^\s]*$/i;

const optional = (value: string): string | undefined => (value ? value : undefined);

export function validateLabelProfileForm(values: LabelProfileFormValues): LabelProfileFormErrors {
  const errors: LabelProfileFormErrors = {};

  if (values.name.trim() === '') {
    errors.name = 'El nombre no puede estar vacío.';
  }
  for (const field of URL_FIELDS) {
    const value = values[field].trim();
    if (value !== '' && !URL_PATTERN.test(value)) {
      errors[field] = 'Ingresá una URL válida que empiece con http:// o https://.';
    }
  }

  return errors;
}

export function toUpdateLabelProfileInput(values: LabelProfileFormValues): UpdateLabelProfileInput {
  return {
    name: values.name.trim(),
    description: optional(values.description.trim()),
    instagramUrl: optional(values.instagramUrl.trim()),
    soundcloudUrl: optional(values.soundcloudUrl.trim()),
    bandcampUrl: optional(values.bandcampUrl.trim()),
    twitterUrl: optional(values.twitterUrl.trim()),
  };
}

export function LabelProfileDataForm({ initial, onSubmit, saving, errorMessage }: Props) {
  const [values, setValues] = useState<LabelProfileFormValues>(() => ({
    name: initial.name ?? '',
    description: initial.description ?? '',
    instagramUrl: initial.instagramUrl ?? '',
    soundcloudUrl: initial.soundcloudUrl ?? '',
    bandcampUrl: initial.bandcampUrl ?? '',
    twitterUrl: initial.twitterUrl ?? '',
  }));
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [saved, setSaved] = useState(false);
  /** Evita dos PUT si se toca "Guardar" dos veces antes de que `saving` llegue a true. */
  const submitting = useRef(false);

  const allErrors = validateLabelProfileForm(values);
  const hasErrors = Object.keys(allErrors).length > 0;
  const errors: LabelProfileFormErrors = submitAttempted ? allErrors : {};

  const setField = (field: LabelProfileFormField) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
  };

  const handleSubmit = async () => {
    if (submitting.current) return;
    setSaved(false);
    setSubmitAttempted(true);
    if (hasErrors) return;

    submitting.current = true;
    try {
      const ok = await onSubmit(toUpdateLabelProfileInput(values));
      setSaved(ok);
    } finally {
      submitting.current = false;
    }
  };

  return (
    <View style={styles.section}>
      <AppText variant="title-md">Datos del sello</AppText>
      <LabeledInput
        label="Nombre"
        value={values.name}
        onChangeText={setField('name')}
        error={errors.name}
        editable={!saving}
      />
      <LabeledInput
        label="Descripción"
        value={values.description}
        onChangeText={setField('description')}
        multiline
        editable={!saving}
      />
      <LabeledInput
        label="Instagram"
        value={values.instagramUrl}
        onChangeText={setField('instagramUrl')}
        error={errors.instagramUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      <LabeledInput
        label="SoundCloud"
        value={values.soundcloudUrl}
        onChangeText={setField('soundcloudUrl')}
        error={errors.soundcloudUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      <LabeledInput
        label="Bandcamp"
        value={values.bandcampUrl}
        onChangeText={setField('bandcampUrl')}
        error={errors.bandcampUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      <LabeledInput
        label="Twitter"
        value={values.twitterUrl}
        onChangeText={setField('twitterUrl')}
        error={errors.twitterUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      {saved ? <SuccessNotice title="Cambios guardados" /> : null}
      <Button
        label="Guardar cambios"
        onPress={handleSubmit}
        loading={saving}
        disabled={submitAttempted && hasErrors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
});
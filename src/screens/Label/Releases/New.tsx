import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LabeledInput } from '../../../components/molecules/LabeledInput';
import { useCreateRelease } from '../../../features/releases/useCreateRelease';
import type { ReleaseType } from '../../../types/releases';

const RELEASE_TYPES: { value: ReleaseType; label: string }[] = [
  { value: 'EP', label: 'EP' },
  { value: 'VA', label: 'VA' },
  { value: 'ALBUM', label: 'Álbum' },
];

type FieldErrors = {
  title?: string;
  artist?: string;
  releaseDate?: string;
};

/** Acepta solo fechas reales en formato `YYYY-MM-DD` (rechaza, por ejemplo, 2026-02-30). */
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function validate(title: string, artist: string, releaseDate: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!title) errors.title = 'El título es obligatorio';
  if (!artist) errors.artist = 'El artista es obligatorio';
  if (releaseDate && !isValidDate(releaseDate)) {
    errors.releaseDate = 'Usá el formato AAAA-MM-DD (ej: 2026-11-20)';
  }
  return errors;
}

/** Alta de release con datos básicos — artwork y audio se cargan después, desde la edición. */
export function LabelReleasesNewScreen() {
  // Navegación imperativa porque volver depende del resultado del POST, no de un toque directo.
  const navigation = useNavigation();
  const { submit, loading, error } = useCreateRelease();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [type, setType] = useState<ReleaseType>('EP');
  const [releaseDate, setReleaseDate] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedArtist = artist.trim();
    const trimmedDate = releaseDate.trim();

    const errors = validate(trimmedTitle, trimmedArtist, trimmedDate);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const ok = await submit({
      title: trimmedTitle,
      artist: trimmedArtist,
      type,
      releaseDate: trimmedDate || undefined,
    });
    if (ok) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="headline-lg">Nuevo release</AppText>

        <LabeledInput
          label="Título *"
          value={title}
          onChangeText={setTitle}
          error={fieldErrors.title}
          editable={!loading}
        />
        <LabeledInput
          label="Artista *"
          value={artist}
          onChangeText={setArtist}
          error={fieldErrors.artist}
          editable={!loading}
        />

        <View style={{ gap: spacing.xs }}>
          <AppText variant="label-caps" color={colors.onSurface.variant}>
            Tipo
          </AppText>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {RELEASE_TYPES.map((option) => (
              <View key={option.value} style={{ flex: 1 }}>
                <Button
                  label={option.label}
                  variant={type === option.value ? 'primary' : 'secondary'}
                  accessibilityState={{ selected: type === option.value, disabled: loading }}
                  disabled={loading}
                  onPress={() => setType(option.value)}
                />
              </View>
            ))}
          </View>
        </View>

        <LabeledInput
          label="Fecha de release"
          placeholder="AAAA-MM-DD"
          value={releaseDate}
          onChangeText={setReleaseDate}
          error={fieldErrors.releaseDate}
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          maxLength={10}
          editable={!loading}
        />

        {error ? <ErrorMessage message={error} /> : null}

        <Button label="Crear release" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { useState } from 'react';
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

const optional = (value: string): string | undefined => (value ? value : undefined);


export function LabelProfileDataForm({ initial, onSubmit, saving, errorMessage }: Props) {
  const [name, setName] = useState(initial.name ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl ?? '');
  const [soundcloudUrl, setSoundcloudUrl] = useState(initial.soundcloudUrl ?? '');
  const [bandcampUrl, setBandcampUrl] = useState(initial.bandcampUrl ?? '');
  const [twitterUrl, setTwitterUrl] = useState(initial.twitterUrl ?? '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {
    setSaved(false);
    const ok = await onSubmit({
      name: optional(name),
      description: optional(description),
      instagramUrl: optional(instagramUrl),
      soundcloudUrl: optional(soundcloudUrl),
      bandcampUrl: optional(bandcampUrl),
      twitterUrl: optional(twitterUrl),
    });
    setSaved(ok);
  };

  return (
    <View style={styles.section}>
      <AppText variant="title-md">Datos del sello</AppText>
      <LabeledInput label="Nombre" value={name} onChangeText={setName} editable={!saving} />
      <LabeledInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        editable={!saving}
      />
      <LabeledInput
        label="Instagram"
        value={instagramUrl}
        onChangeText={setInstagramUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      <LabeledInput
        label="SoundCloud"
        value={soundcloudUrl}
        onChangeText={setSoundcloudUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      <LabeledInput
        label="Bandcamp"
        value={bandcampUrl}
        onChangeText={setBandcampUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      <LabeledInput
        label="Twitter"
        value={twitterUrl}
        onChangeText={setTwitterUrl}
        autoCapitalize="none"
        editable={!saving}
      />
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      {saved ? <SuccessNotice title="Cambios guardados" /> : null}
      <Button label="Guardar cambios" onPress={handleSubmit} loading={saving} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
});
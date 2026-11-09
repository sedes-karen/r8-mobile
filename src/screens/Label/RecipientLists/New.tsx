import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LabeledInput } from '../../../components/molecules/LabeledInput';
import { useCreateRecipientList } from '../../../features/recipients/useCreateRecipientList';

/** Alta de una lista de destinatarios. */
export function LabelRecipientListsNewScreen() {
  const [name, setName] = useState('');
  const { submit, loading, error } = useCreateRecipientList();
  const navigation = useNavigation<any>();

  const canSubmit = name.trim().length > 0 && !loading;

  async function handleCreate() {
    const ok = await submit(name.trim());

    if (ok) {
      setName('');
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          padding: spacing.lg,
          gap: spacing.lg,
        }}
      >
        <AppText variant="headline-lg">
          Nueva lista
        </AppText>

        <LabeledInput
          label="Nombre de la lista"
          value={name}
          onChangeText={setName}
          placeholder="Ej: Prensa especializada"
          autoCapitalize="sentences"
        />

        {error ? <ErrorMessage message={error} /> : null}

        <Button
          label="Crear lista"
          loading={loading}
          disabled={!canSubmit}
          onPress={handleCreate}
        />
      </View>
    </SafeAreaView>
  );
}
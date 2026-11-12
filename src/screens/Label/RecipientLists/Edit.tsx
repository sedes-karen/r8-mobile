import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type StaticScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { ErrorMessage } from '../../../components/atoms/ErrorMessage';
import { LabeledInput } from '../../../components/molecules/LabeledInput';
import { Modal } from '../../../components/molecules/Modal';
import { useEditRecipientList } from '../../../features/recipients/useEditRecipientList';

type RecipientListsStackParamList = {
  List: undefined;
  Details: { listId: string };
  Edit: { listId: string; name: string };
};

type LabelRecipientListsEditScreenProps = StaticScreenProps<{ listId: string; name: string }>;

/**
 * Renombrar o eliminar una lista de destinatarios.
 * Se llega desde Details, que ya tiene la lista cargada y pasa el nombre actual por parámetro
 * (así no hace falta volver a pedirla solo para precargar el input).
 */
export function LabelRecipientListsEditScreen({ route }: LabelRecipientListsEditScreenProps) {
  const { listId, name: currentName } = route.params;
  const [name, setName] = useState(currentName);
  const [showConfirm, setShowConfirm] = useState(false);
  const { rename, remove, loading, error } = useEditRecipientList(listId);
  const navigation = useNavigation<NativeStackNavigationProp<RecipientListsStackParamList>>();

  const trimmedName = name.trim();
  const canSave = trimmedName.length > 0 && trimmedName !== currentName && !loading;

  // Se usa reset en vez de goBack: List y Details quedan montadas debajo de Edit y useAsyncData
  // solo vuelve a pedir datos al montar, así que con goBack se vería el nombre viejo (o la lista
  // ya borrada). Al resetear, las pantallas se vuelven a crear y piden los datos de nuevo.
  async function handleSave() {
    const ok = await rename(trimmedName);
    if (ok) {
      navigation.reset({
        index: 1,
        routes: [{ name: 'List' }, { name: 'Details', params: { listId } }],
      });
    }
  }

  async function handleDelete() {
    setShowConfirm(false);
    const ok = await remove();
    if (ok) {
      navigation.reset({ index: 0, routes: [{ name: 'List' }] });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="headline-lg">Editar lista</AppText>

        <LabeledInput
          label="Nombre de la lista"
          value={name}
          onChangeText={setName}
          placeholder="Ej: Prensa especializada"
          autoCapitalize="sentences"
        />

        {error ? <ErrorMessage message={error} /> : null}

        <Button label="Guardar" loading={loading} disabled={!canSave} onPress={handleSave} />

        <Button
          label="Eliminar lista"
          variant="secondary"
          disabled={loading}
          onPress={() => setShowConfirm(true)}
        />
      </View>
      <Modal
        visible={showConfirm}
        title="Eliminar lista"
        onClose={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        confirmLabel="Eliminar"
      >
        <AppText>¿Seguro que querés eliminar esta lista? No se puede deshacer.</AppText>
      </Modal>
    </SafeAreaView>
  );
}

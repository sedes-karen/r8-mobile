import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StaticScreenProps } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system/legacy';

import { colors, spacing } from '../../../constants/design';
import { AppText } from '../../../components/atoms/AppText';
import { Button } from '../../../components/atoms/Button';
import { ErrorState } from '../../../components/molecules/ErrorState';
import { useBulkUpload } from '../../../features/recipients/useBulkUpload';

type BulkUploadScreenProps = StaticScreenProps<{ listId: string }>;

export function LabelRecipientListsBulkUploadScreen({
  route,
}: BulkUploadScreenProps) {
  const { uploadFile, loading, error, result } = useBulkUpload(
    route.params.listId,
  );

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  async function selectFile() {
    setFileError(null);

    try {
      const selection = await DocumentPicker.getDocumentAsync({
        type: [
          'text/*',
          'application/vnd.ms-excel',
          'application/octet-stream',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (selection.canceled) {
        return;
      }

      const file = selection.assets[0];

      if (!file.name.toLowerCase().endsWith('.csv')) {
        setFileContent(null);
        setFileName(null);
        setFileError('Seleccioná un archivo con extensión .csv.');
        return;
      }

      const content = await readAsStringAsync(file.uri, {
        encoding: 'utf8',
      });

      if (!content.trim()) {
        setFileContent(null);
        setFileName(null);
        setFileError('El archivo CSV está vacío.');
        return;
      }

      setFileContent(content);
      setFileName(file.name);
    } catch {
      setFileError('No se pudo abrir el archivo. Intentá nuevamente.');
    }
  }

  async function importRecipients() {
    if (!fileContent) {
      return;
    }

    setFileError(null);

    try {
      await uploadFile(fileContent);
    } catch {
      // El hook ya guarda y muestra el error de importación.
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <AppText variant="headline-lg">
            Carga masiva de destinatarios
          </AppText>
          <AppText
            variant="body-sm"
            color={colors.onSurface.variant}
          >
            Importá varios destinatarios desde un archivo CSV.
          </AppText>
        </View>

        <View style={{ gap: spacing.sm }}>
          <AppText variant="body-lg">
            El archivo debe contener una columna de email.
            También podés incluir una columna de nombre.
          </AppText>
          <AppText
            variant="body-sm"
            color={colors.onSurface.variant}
          >
            Los emails inválidos y duplicados se descartarán.
          </AppText>
        </View>

        {fileError || error ? (
          <ErrorState message={fileError ?? error ?? ''} />
        ) : null}

        <Button
          label="Seleccionar archivo CSV"
          variant="secondary"
          disabled={loading}
          onPress={() => {
            void selectFile();
          }}
        />

        {fileName ? (
          <AppText variant="body-lg">
            Archivo seleccionado: {fileName}
          </AppText>
        ) : null}

        <Button
          label={loading ? 'Importando...' : 'Importar destinatarios'}
          disabled={loading || !fileContent}
          onPress={() => {
            void importRecipients();
          }}
        />

        {result ? (
          <View style={{ gap: spacing.sm }}>
            <AppText variant="title-md">
              Importación finalizada
            </AppText>
            <AppText variant="body-lg">
              Destinatarios agregados: {result.added.length}
            </AppText>
            <AppText variant="body-lg">
              Omitidos por el servidor: {result.skipped}
            </AppText>
            <AppText variant="body-lg">
              Descartados del archivo: {result.discardedFromFile}
            </AppText>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { createLabelImageUpload, confirmLabelImage } from '../../services/api/labelsApi';

export function useLabelImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploading = useRef(false);

  const uploadImage = useCallback(
    async (uri: string, contentType: string): Promise<boolean> => {
      if (uploading.current) return false;

      uploading.current = true;
      setLoading(true);
      setError(null);

      try {
        // En Android/iOS se lee el archivo local; en web, el blob de la URI.
        const image =
          Platform.OS === 'web' ? await (await fetch(uri)).blob() : new File(uri);

        if (image.size === 0) {
          throw new Error('No se pudo leer el contenido de la imagen');
        }

        // URL temporal de subida.
        const { uploadUrl, path } = await createLabelImageUpload({ contentType });

        // Subida del binario.
        const uploadResponse = await expoFetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': contentType },
          body: image,
        });

        if (!uploadResponse.ok) {
          throw new Error(`No se pudo subir la imagen (${uploadResponse.status})`);
        }

        // Confirmación al backend.
        await confirmLabelImage({ path });

        return true;
      } catch (caught: unknown) {
        setError(caught instanceof Error ? caught.message : 'Error al subir la imagen');
        return false;
      } finally {
        uploading.current = false;
        setLoading(false);
      }
    },
    [],
  );

  return { uploadImage, loading, error };
}

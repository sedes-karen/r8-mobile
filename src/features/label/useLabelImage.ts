import { useCallback, useRef, useState } from 'react';
import {createLabelImageUpload,confirmLabelImage,}from '../../services/api/labelsApi';
import { Platform } from 'react-native';
import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';

export function useLabelImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploading = useRef(false);

  const uploadImage = useCallback(
    async (_uri: string, _contentType: string): Promise<boolean> => {
      if (uploading.current) return false;

      uploading.current = true;
      setLoading(true);
      setError(null);

      try {
        // En Android/iOS, leer directamente el archivo local.
        const image =
          Platform.OS === 'web'
            ? await (await fetch(_uri)).blob()
            : new File(_uri);

        if (image.size === 0) {
          throw new Error('No se pudo leer el contenido de la imagen');
        }

        // Pedir una URL temporal de subida.
        const { uploadUrl, path } = await createLabelImageUpload({
          contentType: _contentType,
        });

        // Subir el contenido del archivo.
        const uploadResponse = await expoFetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': _contentType,
          },
          body: image,
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `No se pudo subir la imagen (${uploadResponse.status})`,
          );
        }

        // Confirmar la subida al backend.
        await confirmLabelImage({ path });

        return true;
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : 'Error al subir la imagen',
        );

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
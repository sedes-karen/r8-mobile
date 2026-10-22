
import { useState } from 'react';
import {
  addRecipientsBatch,
  type AddRecipientsBatchResponse,
} from '../../services/api/recipientListsApi';
import { parseRecipientsFile } from './parseRecipientsFile';

export type BulkUploadResult = AddRecipientsBatchResponse & {
  discardedFromFile: number;
};

export function useBulkUpload(listId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkUploadResult | null>(null);

  async function uploadFile(content: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsed = parseRecipientsFile(content);

      if (parsed.recipients.length === 0) {
        throw new Error(
          'El archivo no contiene destinatarios válidos para importar.',
        );
      }

      const response = await addRecipientsBatch(
        listId,
        parsed.recipients,
      );

      const uploadResult: BulkUploadResult = {
        ...response,
        discardedFromFile: parsed.descartados,
      };

      setResult(uploadResult);
      return uploadResult;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al importar los destinatarios.';

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    uploadFile,
    loading,
    error,
    result,
  };
}

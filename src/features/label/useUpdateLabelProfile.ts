import { useCallback, useState } from 'react';
import { updateLabel } from '../../services/api/labelsApi';

export type UpdateLabelProfileInput = Parameters<typeof updateLabel>[0];
export type UpdateLabelProfileResult = Awaited<ReturnType<typeof updateLabel>>;

/**
 * Actualiza el perfil del label y expone el estado de guardado para la pantalla de edición.
 * El error se vuelve a lanzar para que la pantalla pueda decidir efectos posteriores al éxito,
 * como navegar o mostrar una confirmación, sin ocultar el estado de error del formulario.
 */
export function useUpdateLabelProfile() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (data: UpdateLabelProfileInput): Promise<UpdateLabelProfileResult> => {
      setSaving(true);
      setError(null);

      try {
        return await updateLabel(data);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'No se pudo actualizar el perfil';
        setError(message);
        throw cause;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { updateProfile, saving, error };
}

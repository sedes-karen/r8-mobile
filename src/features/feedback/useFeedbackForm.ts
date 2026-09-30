import { useCallback, useState } from 'react';
import { submitFeedback } from '../../services/api/feedbackApi';
import type {
  FeedbackEntity,
  FeedbackFormErrors,
  FeedbackFormValues,
  UpdateFeedbackBody,
} from '../../types/feedback/form';

/** Escala de calificación del formulario: la API solo espera un entero, la UI define el rango. */
export const MIN_RATING = 1;
export const MAX_RATING = 5;

/** Tope del comentario — evita mandarle al label un texto infinito en el body del PATCH. */
export const COMMENT_MAX_LENGTH = 500;

const EMPTY_VALUES: FeedbackFormValues = {
  rating: null,
  comment: '',
  willPlay: null,
  supported: null,
};

/**
 * Validación del formulario de feedback. Va aparte y como función pura para poder testearla sin
 * montar la pantalla: la API declara los cuatro campos como opcionales, así que las reglas de
 * "obligatorio" son decisión de la pantalla, no del contrato.
 */
export function validateFeedbackForm(values: FeedbackFormValues): FeedbackFormErrors {
  const errors: FeedbackFormErrors = {};

  if (
    values.rating === null ||
    values.rating < MIN_RATING ||
    values.rating > MAX_RATING ||
    !Number.isInteger(values.rating)
  ) {
    errors.rating = `Elegí una calificación de ${MIN_RATING} a ${MAX_RATING}.`;
  }
  if (values.willPlay === null) {
    errors.willPlay = 'Contanos si la vas a sumar a una playlist.';
  }
  if (values.supported === null) {
    errors.supported = 'Contanos si vas a apoyar el release.';
  }
  if (values.comment.length > COMMENT_MAX_LENGTH) {
    errors.comment = `El comentario puede tener hasta ${COMMENT_MAX_LENGTH} caracteres.`;
  }

  return errors;
}

/** El comentario va como `null` (no string vacío) cuando el receptor no escribió nada. */
export function toUpdateFeedbackBody(values: FeedbackFormValues): UpdateFeedbackBody {
  const comment = values.comment.trim();
  return {
    rating: values.rating as number,
    comment: comment === '' ? null : comment,
    willPlay: values.willPlay as boolean,
    supported: values.supported as boolean,
  };
}

/**
 * Estado del formulario de feedback: valores, validación y envío.
 *
 * Los errores recién se muestran después del primer intento (así no se le grita al usuario antes
 * de que toque nada) y se van limpiando a medida que corrige, porque `validateFeedbackForm` se
 * vuelve a correr en cada cambio.
 */
export function useFeedbackForm() {
  const [values, setValues] = useState<FeedbackFormValues>(EMPTY_VALUES);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<FeedbackEntity | null>(null);

  const allErrors = validateFeedbackForm(values);
  const errors: FeedbackFormErrors = submitAttempted ? allErrors : {};

  const setRating = useCallback((rating: number) => {
    setValues((current) => ({ ...current, rating }));
  }, []);

  const setComment = useCallback((comment: string) => {
    setValues((current) => ({ ...current, comment }));
  }, []);

  const setWillPlay = useCallback((willPlay: boolean) => {
    setValues((current) => ({ ...current, willPlay }));
  }, []);

  const setSupported = useCallback((supported: boolean) => {
    setValues((current) => ({ ...current, supported }));
  }, []);

  const submit = useCallback(
    async (releaseId: string, feedbackId: string) => {
      setSubmitAttempted(true);
      if (Object.keys(allErrors).length > 0) {
        return;
      }

      setSubmitting(true);
      setError(null);
      try {
        setSubmitted(await submitFeedback(releaseId, feedbackId, toUpdateFeedbackBody(values)));
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : 'No se pudo enviar el feedback');
      } finally {
        setSubmitting(false);
      }
    },
    [allErrors, values],
  );

  return {
    values,
    errors,
    submitAttempted,
    submitting,
    error,
    /** Feedback devuelto por la API al enviar bien: la pantalla pasa a mostrarlo en solo lectura. */
    submitted,
    setRating,
    setComment,
    setWillPlay,
    setSupported,
    submit,
  };
}

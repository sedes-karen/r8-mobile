import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';
import { RatingSelector } from '../molecules/RatingSelector';
import { YesNoChoice } from '../molecules/YesNoChoice';
import type { FeedbackFormErrors, FeedbackFormValues } from '../../types/feedback/form';

type FeedbackFormProps = {
  values: FeedbackFormValues;
  errors: FeedbackFormErrors;
  submitting: boolean;
  error: string | null;
  /** Viene de la pantalla (que lo saca de la validación) para que el organismo no dependa del hook. */
  commentMaxLength: number;
  onChangeRating: (rating: number) => void;
  onChangeComment: (comment: string) => void;
  onChangeWillPlay: (willPlay: boolean) => void;
  onChangeSupported: (supported: boolean) => void;
  onSubmit: () => void;
};

/**
 * Organismo del formulario de retroalimentación. Sin HTTP: arma la UI a partir de átomos y
 * moléculas y emite los cambios hacia arriba, donde vive la validación (`useFeedbackForm`) — ver
 * ATOMIC_DESIGN.md §2.3.
 */
export function FeedbackForm({
  values,
  errors,
  submitting,
  error,
  commentMaxLength,
  onChangeRating,
  onChangeComment,
  onChangeWillPlay,
  onChangeSupported,
  onSubmit,
}: FeedbackFormProps) {
  return (
    <View style={{ gap: spacing.lg }}>
      <RatingSelector
        label="Calificación"
        value={values.rating}
        onChange={onChangeRating}
        error={errors.rating}
        disabled={submitting}
      />

      <View style={{ gap: spacing.xs }}>
        <LabeledInput
          label="Comentario"
          value={values.comment}
          onChangeText={onChangeComment}
          error={errors.comment}
          placeholder="¿Qué te pareció el release?"
          multiline
          numberOfLines={4}
          maxLength={commentMaxLength}
          editable={!submitting}
          style={{ minHeight: 96, textAlignVertical: 'top' }}
        />
        <AppText variant="label-micro" color={colors.onSurface.variant}>
          {`${values.comment.length}/${commentMaxLength}`}
        </AppText>
      </View>

      <YesNoChoice
        label="¿La vas a sumar a una playlist?"
        value={values.willPlay}
        onChange={onChangeWillPlay}
        error={errors.willPlay}
        disabled={submitting}
      />

      <YesNoChoice
        label="¿Vas a apoyar el release?"
        value={values.supported}
        onChange={onChangeSupported}
        error={errors.supported}
        disabled={submitting}
      />

      {error ? <ErrorMessage message={error} /> : null}

      <Button
        label="Enviar feedback"
        onPress={onSubmit}
        loading={submitting}
        disabled={submitting}
      />
    </View>
  );
}

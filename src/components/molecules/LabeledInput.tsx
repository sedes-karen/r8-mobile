import { View, type TextInputProps } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Input } from '../atoms/Input';
import { ErrorMessage } from '../atoms/ErrorMessage';

type LabeledInputProps = TextInputProps & {
  label: string;
  error?: string;
};

/** Label + Input + error de campo, el trío que se repite en cualquier formulario. */
export function LabeledInput({ label, error, ...inputProps }: LabeledInputProps) {
  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="label-caps" color={colors.onSurface.variant}>
        {label}
      </AppText>
      <Input hasError={Boolean(error)} {...inputProps} />
      {error ? <ErrorMessage message={error} /> : null}
    </View>
  );
}

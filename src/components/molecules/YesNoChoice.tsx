import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';

type YesNoChoiceProps = {
  label: string;
  /** `null` = todavía sin elegir, que es lo que dispara el error de validación. */
  value: boolean | null;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
};

const OPTIONS: Array<{ label: string; value: boolean }> = [
  { label: 'Sí', value: true },
  { label: 'No', value: false },
];

/**
 * Elección Sí/No para las preguntas cerradas del formulario (intención de reproducción y
 * soporte del release). Se apoya en `Button` para no inventar otro control: la opción elegida
 * queda como primary y las demás como secondary.
 */
export function YesNoChoice({ label, value, onChange, error, disabled = false }: YesNoChoiceProps) {
  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="label-caps" color={colors.onSurface.variant}>
        {label}
      </AppText>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {OPTIONS.map((option) => (
          <Button
            key={option.label}
            label={option.label}
            variant={value === option.value ? 'primary' : 'secondary'}
            disabled={disabled}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
      {error ? <ErrorMessage message={error} /> : null}
    </View>
  );
}

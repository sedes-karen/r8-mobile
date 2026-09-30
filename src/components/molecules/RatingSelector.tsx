import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { ErrorMessage } from '../atoms/ErrorMessage';

type RatingSelectorProps = {
  label: string;
  /** `null` mientras el usuario no eligió — la pantalla lo distingue de un 0 inválido. */
  value: number | null;
  onChange: (value: number) => void;
  max?: number;
  error?: string;
  disabled?: boolean;
};

/** Mismo mínimo que usa `Button` para que las dos cosas se puedan tocar igual. */
const MIN_TOUCH_SIZE = 44;

/**
 * Selección de calificación por puntos (1..5 por defecto). Controlado y sin estado propio: la
 * validación del formulario vive en `useFeedbackForm`, acá solo se pinta el error.
 */
export function RatingSelector({ label, value, onChange, max = 5, error, disabled = false }: RatingSelectorProps) {
  const options = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="label-caps" color={colors.onSurface.variant}>
        {label}
      </AppText>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option <= (value ?? 0);
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={`${option} de ${max}`}
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <AppText
                variant="title-md"
                color={selected ? colors.primary.foreground : colors.onSurface.default}
              >
                {option}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? <ErrorMessage message={error} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.container,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  optionSelected: {
    backgroundColor: colors.primary.default,
    borderColor: colors.primary.default,
  },
  optionPressed: {
    backgroundColor: colors.surface.containerHigh,
  },
});

import { Pressable, StyleSheet, View } from 'react-native';
import { borderRadius, colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { ErrorMessage } from '../atoms/ErrorMessage';

type ReleaseTypeSelectorProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  error?: string;
};

/**
 * Selector segmentado de opciones cortas (ej. EP/VA/ALBUM) — genérico a propósito para que
 * New y Edit lo compartan; la pantalla es la que decide qué valores ofrece.
 */
export function ReleaseTypeSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  error,
}: ReleaseTypeSelectorProps<T>) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="label-caps" color={colors.onSurface.variant}>
        {label}
      </AppText>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() => onChange(option)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <AppText
                variant="body-sm"
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
  wrapper: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.containerHigh,
    borderRadius: borderRadius.full,
  },
  optionSelected: {
    backgroundColor: colors.primary.default,
  },
});

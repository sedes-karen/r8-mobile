import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
};

const VARIANT_STYLES: Record<ButtonVariant, { background: string; text: string }> = {
  primary: { background: colors.primary.default, text: colors.primary.foreground },
  secondary: { background: colors.surface.containerHigh, text: colors.onSurface.default },
};

/** Botón base — variantes primary/secondary, sin lógica de negocio. */
export function Button({ label, variant = 'primary', loading = false, disabled, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading;
  const { background, text } = VARIANT_STYLES[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={{
        backgroundColor: background,
        opacity: isDisabled ? 0.5 : 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <AppText variant="title-md" color={text}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

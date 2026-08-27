import { TextInput, type TextInputProps } from 'react-native';
import { colors, spacing, typography, fontFamilyForVariant } from '../../constants/design';

type InputProps = TextInputProps & {
  hasError?: boolean;
};

/** Campo de texto controlado base — sin label ni error visible, eso lo arma LabeledInput. */
export function Input({ hasError = false, style, ...rest }: InputProps) {
  const bodyLg = typography.variants['body-lg'];
  return (
    <TextInput
      placeholderTextColor={colors.onSurface.variant}
      style={[
        {
          fontFamily: fontFamilyForVariant('body-lg'),
          fontSize: bodyLg.fontSize,
          color: colors.onSurface.default,
          backgroundColor: colors.surface.container,
          borderWidth: 1,
          borderColor: hasError ? colors.error.default : colors.surface.border,
          borderRadius: 0,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          minHeight: 44,
        },
        style,
      ]}
      {...rest}
    />
  );
}

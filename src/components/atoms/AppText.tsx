import { Text, type TextProps } from 'react-native';
import { colors, fontFamilyForVariant, typography, type TypographyVariant } from '../../constants/design';

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

/**
 * Átomo de texto base — todo texto de la app pasa por acá para heredar la tipografía de
 * `constants/design.ts` en vez de estilos sueltos por pantalla.
 */
export function AppText({ variant = 'body-lg', color = colors.onSurface.default, style, ...rest }: AppTextProps) {
  const scale = typography.variants[variant];
  return (
    <Text
      style={[
        {
          fontFamily: fontFamilyForVariant(variant),
          fontSize: scale.fontSize,
          lineHeight: scale.lineHeight,
          letterSpacing: scale.letterSpacing,
          color,
        },
        style,
      ]}
      {...rest}
    />
  );
}

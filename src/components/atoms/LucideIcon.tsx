import { Lucide, LucideIconName } from '@react-native-vector-icons/lucide';
import { colors, typography, type TypographyVariant } from '../../constants/design';
import { TextProps } from 'react-native';

type LucideIconProps = TextProps & {
  name: LucideIconName,
  variant?: TypographyVariant;
  color?: string;
};

/**
 * Ícono de Lucide, para UI general (no marcas).
 * Lista: https://lucide.dev/icons/?focus
 * Se pueden cambiar adicionalmente mediante style: borderWidth, borderRadius, padding, margin, etc.
*/
export function LucideIcon({ name, variant = 'body-lg', color = colors.onSurface.default, style, ...rest }: LucideIconProps) {
  const scale = typography.variants[variant];
  return (
    <Lucide
      name={name}
      style={[
        {
          fontSize: scale.fontSize,
          lineHeight: scale.lineHeight,
          color: color,
          borderColor: color,
        },
        style,
      ]}
      {...rest}
    />
  );
}

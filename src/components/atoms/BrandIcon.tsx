import { FontAwesomeFreeBrands, FontAwesomeFreeBrandsIconName } from '@react-native-vector-icons/fontawesome-free-brands';
import { colors, typography, type TypographyVariant } from '../../constants/design';
import { TextProps } from 'react-native';

type BrandIconProps = TextProps & {
  name: FontAwesomeFreeBrandsIconName,
  variant?: TypographyVariant;
  color?: string;
};

/**
 * Ícono de una marca registrada
 * Lista: https://fontawesome.com/search?ic=free-collection&ip=brands
 * Se pueden cambiar adicionalmente mediante style: borderWidth, borderRadius, padding, margin, etc.
*/
export function BrandIcon({ name, variant = 'body-lg', color = colors.onSurface.default, style, ...rest }: BrandIconProps) {
  const scale = typography.variants[variant];
  return (
    <FontAwesomeFreeBrands
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

import { View } from 'react-native';
import { borderRadius, colors, spacing } from '../../constants/design';
import { AppText } from './AppText';

type BadgeProps = {
  label: string;
};

/**
 * Etiqueta corta de estado. Los pills son la única forma redondeada del sistema: el resto de las
 * superficies van con esquinas rectas (ver el comentario sobre borderRadius en design.ts).
 *
 * Hoy solo existe la variante de error, que es el único caso de uso en el código. Cuando aparezca
 * un segundo estado (promo enviada, release publicado, etc.) conviene sumarle una prop `tone` en
 * vez de duplicar el componente.
 *
 * `alignSelf: 'flex-start'` para que no se estire al ancho del contenedor dentro de un View en
 * columna.
 */
export function Badge({ label }: BadgeProps) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: colors.error.container,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
      }}
    >
      <AppText variant="label-micro" color={colors.error.onContainer}>
        {label}
      </AppText>
    </View>
  );
}

import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

type MetaDataRowProps = {
  label: string;
  value?: string | number | null;
  /** Permite pasar un componente custom en lugar de texto plano para el valor (ej: un Badge o Tag). */
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
};

/**
 * Fila de metadata de solo lectura (label + valor), pensada para los detalles de release y promo.
 * Acepta un valor en texto plano o un componente custom vía `children`.
 */
export function MetaDataRow({ label, value, children, containerStyle, labelStyle, valueStyle }: MetaDataRowProps) {
  if (children === undefined && value === undefined) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <AppText variant="body-sm" color={colors.onSurface.variant} style={[styles.label, labelStyle]}>
        {label}
      </AppText>
      {children ? (
        children
      ) : (
        <AppText variant="body-lg" style={[styles.value, valueStyle]} numberOfLines={2}>
          {value ?? '—'}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  label: {
    marginRight: spacing.md,
    flex: 1,
  },
  value: {
    textAlign: 'right',
    flex: 1.5,
  },
});
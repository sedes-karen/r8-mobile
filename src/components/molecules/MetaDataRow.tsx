import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface MetaDataRowProps {
  label: string;
  value?: string | number | null;
  /** Permite pasar un componente custom en lugar de texto plano para el valor (ej: un Badge o Tag) */
  children?: React.ReactNode;
  /** Estilos opcionales para personalizar el contenedor o los textos */
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export const MetaDataRow: React.FC<MetaDataRowProps> = ({
  label,
  value,
  children,
  containerStyle,
  labelStyle,
  valueStyle,
}) => {
  // Si no hay valor ni hijos, no renderizamos una fila vacía
  if (value === undefined && value === null && !children) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>

      {children ? (
        children
      ) : (
        <Text style={[styles.value, valueStyle]} numberOfLines={2}>
          {value ?? '-'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  label: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginRight: 12,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1.5,
  },
});
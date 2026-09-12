import { StyleSheet, View, type TextInputProps } from 'react-native';
import { spacing } from '../../constants/design';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export type SearchFieldProps = Omit<
  TextInputProps,
  'value' | 'defaultValue' | 'onChangeText'
> & {
  value: string;
  onChangeText: (value: string) => void;
  clearLabel?: string;
};

/** La pantalla mantiene el texto y decide cómo filtrar sus datos. */
export function SearchField({
  value,
  onChangeText,
  clearLabel = 'Limpiar búsqueda',
  placeholder = 'Buscar...',
  accessibilityLabel = 'Buscar',
  editable = true,
  readOnly = false,
  style,
  ...inputProps
}: SearchFieldProps) {
  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        {...inputProps}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel}
        editable={editable}
        readOnly={!editable || readOnly}
        style={[styles.input, style]}
      />
      {value.length > 0 ? (
        <Button
          label={clearLabel}
          variant="secondary"
          disabled={!editable || readOnly}
          onPress={() => onChangeText('')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  input: {
    alignSelf: 'stretch',
  },
});

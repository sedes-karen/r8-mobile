//ejemplo CLASE_02_PRACTICA_B.md
import { Text, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { colors} from '../../constants/design';

type Variant = 'title' | 'body' | 'caption';

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
};

const variantStyles: Record<Variant, TextStyle> = {
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  return (
    <Text
      style={[
        styles.base,
        variantStyles[variant],
        muted && styles.muted,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { color: colors.text },
  muted: { color: colors.textMuted },
});
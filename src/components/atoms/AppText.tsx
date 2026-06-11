import { Text, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { colors, fontSizes, fontWeights } from '../../constants/design';

type Variant = 'title' | 'body' | 'caption';

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
};

const variantStyles: Record<Variant, TextStyle> = {
  title: { fontSize: fontSizes['2xl'], fontWeight: fontWeights.bold },
  body: { fontSize: fontSizes.md, fontWeight: fontWeights.normal },
  caption: { fontSize: fontSizes.xs, fontWeight: fontWeights.normal },
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
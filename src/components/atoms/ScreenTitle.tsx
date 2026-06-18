import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { spacing } from '../../constants/design';

type Props = { title: string; subtitle?: string };

export function ScreenTitle({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" muted style={styles.sub}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  sub: { marginTop: spacing.xs },
});
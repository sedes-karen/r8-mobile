import { StyleSheet } from 'react-native';
import { spacing, fontSizes, fontWeights } from '../../../constants/design';

export const styles = StyleSheet.create({
    errorContainer: {
        padding: spacing.md,
        borderRadius: spacing.sm,
        borderWidth: spacing.px,
        marginVertical: spacing.sm,
    },
    errorText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
    },
});
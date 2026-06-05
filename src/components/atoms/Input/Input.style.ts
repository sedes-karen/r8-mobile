import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../../../constants/design';

export const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingVertical: spacing.xs * 2.5,
        paddingHorizontal: spacing.sm + spacing.xs * 1.5,
        borderWidth: 1,
        borderColor: colors.neutralLight,
        borderRadius: borderRadius.md,
        fontSize: fontSizes.sm,
        color: colors.text,
        backgroundColor: colors.background,
        marginBottom: spacing.sm,
    },
    focused: {
        borderColor: colors.primary,
    },
    disabled: {
        backgroundColor: colors.neutralLight,
        color: colors.textMuted,
        opacity: 0.7,
    },
    hasError: {
        borderColor: colors.error,
    },
});

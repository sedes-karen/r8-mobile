import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../../../constants/design';

export const styles = StyleSheet.create({
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.sm,
    },
    disabled: {
        opacity: 0.6,
    },
    box: {
        width: spacing.lg,
        height: spacing.lg,
        borderWidth: spacing.px,
        borderColor: colors.primary,
        borderRadius: borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
        backgroundColor: colors.background,
    },
    boxChecked: {
        backgroundColor: colors.primary,
    },
    boxDisabled: {
        borderColor: colors.textMuted,
        backgroundColor: 'transparent',
    },
    checkmark: {
        color: colors.neutralLight,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: spacing.md,
    },
    checkmarkDisabled: {
        color: colors.textMuted,
    },
    checkboxLabel: {
        fontSize: fontSizes.md,
        color: colors.neutralDark,
    },
    labelDisabled: {
        color: colors.neutral,
    },
});
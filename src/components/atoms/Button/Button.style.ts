import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../../constants/design';

export const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: borderRadius.sm,
    },
    content: {
        fontWeight: fontWeights.semibold,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.background,
        borderColor: colors.neutralLight,
    },
    danger: {
        backgroundColor: colors.error,
    },
    success: {
        backgroundColor: colors.success,
    },
    primaryText: {
        color: colors.onPrimary,
    },
    secondaryText: {
        color: colors.text,
    },
    dangerText: {
        color: colors.onError,
    },
    successText: {
        color: colors.onPrimary,
    },
    sm: {
        paddingVertical: spacing.xs + spacing.px * 2,
        paddingHorizontal: spacing.s3,
    },
    md: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    lg: {
        paddingVertical: spacing.s3,
        paddingHorizontal: spacing.lg,
    },
    smText: {
        fontSize: 11,
    },
    mdText: {
        fontSize: fontSizes.xs,
    },
    lgText: {
        fontSize: fontSizes.sm,
    },
});

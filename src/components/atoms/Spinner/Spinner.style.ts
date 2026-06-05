import { StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../../../constants/design';

export const styles = StyleSheet.create({
    spinner: {
        borderStyle: 'solid',
        borderRadius: borderRadius.full,
        borderColor: `${colors.primary}26`,
        borderTopColor: colors.primary,
    },

    sm: {
        width: spacing.s5,
        height: spacing.s5,
        borderWidth: 2,
    },
    md: {
        width: spacing.s10,
        height: spacing.s10,
        borderWidth: 3,
    },
    lg: {
        width: 64,
        height: 64,
        borderWidth: 4,
    },
});

import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../../../constants/design';

export const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 6,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.background,
        marginBottom: spacing.sm,
    },
    focused: {
        borderColor: colors.primary,
    },
    disabled: {
        backgroundColor: '#F3F4F6',
        color: colors.textMuted,
        opacity: 0.7,
    },
    hasError: {
        borderColor: colors.error || '#ef4444',
    },
});

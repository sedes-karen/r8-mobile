import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/design';

export const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 6,
    },
    content: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.background,
        borderColor: '#E5E7EB',
    },
    danger: {
        backgroundColor: colors.error || '#ef4444',
    },
    success: {
        backgroundColor: '#10b981',
    },
    primaryText: {
        color: '#ffffff',
    },
    secondaryText: {
        color: colors.text,
    },
    dangerText: {
        color: '#ffffff',
    },
    successText: {
        color: '#ffffff',
    },
    sm: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    md: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    lg: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    smText: {
        fontSize: 11,
    },
    mdText: {
        fontSize: 12,
    },
    lgText: {
        fontSize: 14,
    },
});

import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/design';

export const styles = StyleSheet.create({
    avatarContainer: {
        overflow: 'hidden',
        backgroundColor: colors.background,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    sm: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    md: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    lg: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
});
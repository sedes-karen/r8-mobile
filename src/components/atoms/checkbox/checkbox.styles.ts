import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    disabled: {
        opacity: 0.6,
    },
    box: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: 'transparent',
    },
    boxChecked: {
        backgroundColor: '#007AFF',
    },
    boxDisabled: {
        borderColor: '#A1A1A1',
        backgroundColor: 'transparent',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 18,
    },
    checkmarkDisabled: {
        color: '#A1A1A1',
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333333',
    },
    labelDisabled: {
        color: '#A1A1A1',
    },
});
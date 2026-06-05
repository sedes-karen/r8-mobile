import React from 'react';
import { styles } from './ErrorMessage.style';
import { View, Text, ViewStyle } from 'react-native';

export type ErrorVariant = 'critical' | 'warning' | 'info';

interface ErrorMessageProps {
    message: string;
    variant?: ErrorVariant;
}

const variantStyles: Record<ErrorVariant, ViewStyle> = {
    critical: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
    },
    warning: {
        backgroundColor: '#FEF3C7',
        borderColor: '#F59E0B',
    },
    info: {
        backgroundColor: '#DBEAFE',
        borderColor: '#3B82F6',
    },
};

export default function ErrorMessage({ message, variant = 'critical' }: ErrorMessageProps) {
    const variantStyle = variantStyles[variant];

    return (
        <View style={[styles.errorContainer, variantStyle]}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
}

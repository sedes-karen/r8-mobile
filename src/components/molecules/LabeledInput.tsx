import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Input, type InputProps } from '../atoms/Input';
import { Text } from '../atoms/Text';
import { spacing } from '../../constants/design';

export interface LabeledInputProps extends InputProps {
    label: string;
    error?: string;
}

export function LabeledInput({ label, error, type, ...rest }: LabeledInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordType = type === 'password';

    const currentType = isPasswordType && isPasswordVisible ? 'text' : type;

    return (
        <View style={styles.container}>
            <Text variant="label" style={styles.label}>
                {label}
            </Text>

            <View style={styles.inputWrapper}>
                <Input
                    type={currentType}
                    hasError={!!error}
                    style={isPasswordType ? styles.inputWithButton : undefined}
                    {...rest}
                />

                {isPasswordType && (
                    <Pressable
                        style={styles.toggleButton}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Text variant="small" color="primary">
                            {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
                        </Text>
                    </Pressable>
                )}
            </View>

            {error ? (
                <Text variant="small" color="error" style={styles.errorText}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
        width: '100%',
    },
    label: {
        marginBottom: spacing.xs,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputWithButton: {
        paddingRight: 70,
    },
    toggleButton: {
        position: 'absolute',
        right: spacing.md,
        top: 0,
        bottom: spacing.sm,
        justifyContent: 'center',
    },
    errorText: {
        marginTop: spacing.xs,
    }
});

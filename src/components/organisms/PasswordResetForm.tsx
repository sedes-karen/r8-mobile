import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LabeledInput } from '../molecules/LabeledInput';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { spacing } from '../../constants/design';

export interface PasswordResetFormProps {
    onSubmit: (email: string) => void;
    isLoading?: boolean;
    error?: string;
    successMessage?: string;
}

export function PasswordResetForm({ onSubmit, isLoading = false, error, successMessage }: PasswordResetFormProps) {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (!email) return;
        onSubmit(email);
    };

    return (
        <View style={styles.container}>
            <View style={styles.fieldsContainer}>
                <LabeledInput
                    label="Correo electrónico"
                    type="email"
                    placeholder="Ingresa el correo de tu cuenta"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                />
            </View>

            {error ? (
                <Text variant="small" color="error" style={styles.messageText}>
                    {error}
                </Text>
            ) : null}

            {successMessage ? (
                <Text variant="small" color="success" style={styles.messageText}>
                    {successMessage}
                </Text>
            ) : null}

            <Button
                variant="primary"
                size="lg"
                onPress={handleSubmit}
                disabled={isLoading || !email}
                style={styles.button}
            >
                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    fieldsContainer: {
        gap: spacing.sm,
    },
    messageText: {
        marginTop: spacing.md,
        textAlign: 'center',
    },
    button: {
        marginTop: spacing.lg,
    }
});

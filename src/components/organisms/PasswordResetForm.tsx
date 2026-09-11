import { useState } from 'react';
import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';

export interface PasswordResetFormProps {
    email?: string;
    onChangeEmail?: (value: string) => void;
    onSubmit: (email: string) => void;
    loading?: boolean;
    error?: string | null;
    successMessage?: string | null;
}

export function PasswordResetForm({
    email: controlledEmail,
    onChangeEmail,
    onSubmit,
    loading = false,
    error,
    successMessage,
}: PasswordResetFormProps) {
    const [internalEmail, setInternalEmail] = useState('');

    const email = controlledEmail !== undefined ? controlledEmail : internalEmail;
    const setEmail = (val: string) => {
        if (onChangeEmail) onChangeEmail(val);
        setInternalEmail(val);
    };

    const handleSubmit = () => {
        if (!email || loading) return;
        onSubmit(email);
    };

    return (
        <View style={{ gap: spacing.md }}>
            <LabeledInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="tu@email.com"
                editable={!loading}
            />

            {error ? <ErrorMessage message={error} /> : null}

            {successMessage ? (
                <AppText variant="body-sm" color={colors.secondary.default}>
                    {successMessage}
                </AppText>
            ) : null}

            <Button
                label="Enviar enlace de recuperación"
                onPress={handleSubmit}
                loading={loading}
                disabled={!email || loading}
            />
        </View>
    );
}

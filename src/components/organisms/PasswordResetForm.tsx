import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';

type PasswordResetFormProps = {
    email: string;
    onChangeEmail: (value: string) => void;
    onSubmit: () => void;
    loading: boolean;
    error: string | null;
    successMessage?: string | null;
};

export function PasswordResetForm({
    email,
    onChangeEmail,
    onSubmit,
    loading,
    error,
    successMessage,
}: PasswordResetFormProps) {
    return (
        <View style={{ gap: spacing.md }}>
            <LabeledInput
                label="Correo electrónico"
                value={email}
                onChangeText={onChangeEmail}
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
                onPress={onSubmit}
                loading={loading}
                disabled={!email || loading}
            />
        </View>
    );
}

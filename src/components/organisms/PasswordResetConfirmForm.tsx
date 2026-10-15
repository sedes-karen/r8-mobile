import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { LabeledInput } from '../molecules/LabeledInput';

type PasswordResetConfirmFormProps = {
    code: string;
    newPassword: string;
    confirmPassword: string;
    onChangeCode: (value: string) => void;
    onChangeNewPassword: (value: string) => void;
    onChangeConfirmPassword: (value: string) => void;
    onSubmit: () => void;
    loading: boolean;
    error: string | null;
    successMessage?: string | null;
};

export function PasswordResetConfirmForm({
    code,
    newPassword,
    confirmPassword,
    onChangeCode,
    onChangeNewPassword,
    onChangeConfirmPassword,
    onSubmit,
    loading,
    error,
    successMessage,
}: PasswordResetConfirmFormProps) {
    const isCodeValid = code.trim().length === 4;
    const isPasswordMinLength = newPassword.length >= 6;
    const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
    const isValid = isCodeValid && isPasswordMinLength && doPasswordsMatch;

    return (
        <View style={{ gap: spacing.md }}>
            <LabeledInput
                label="Código de verificación (4 dígitos)"
                value={code}
                onChangeText={onChangeCode}
                maxLength={4}
                keyboardType="number-pad"
                placeholder="1234"
                editable={!loading}
            />

            <LabeledInput
                label="Nueva contraseña"
                value={newPassword}
                onChangeText={onChangeNewPassword}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry
                placeholder="••••••••"
                editable={!loading}
            />

            <LabeledInput
                label="Confirmar nueva contraseña"
                value={confirmPassword}
                onChangeText={onChangeConfirmPassword}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry
                placeholder="••••••••"
                editable={!loading}
            />

            {error ? <ErrorMessage message={error} /> : null}

            {successMessage ? (
                <AppText variant="body-sm" color={colors.secondary.default}>
                    {successMessage}
                </AppText>
            ) : null}

            <Button
                label="Restablecer contraseña"
                onPress={onSubmit}
                loading={loading}
                disabled={!isValid || loading}
            />
        </View>
    );
}

export default PasswordResetConfirmForm;

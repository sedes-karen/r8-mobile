import React, { useState } from 'react';
import { TextInput, StyleSheet, type TextInputProps, type StyleProp, type TextStyle, type FocusEvent } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../../../constants/design';

export interface InputProps extends Omit<TextInputProps, 'style'> {
    ref?: React.Ref<TextInput>;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    hasError?: boolean;
    style?: StyleProp<TextStyle>;
}

export const Input = ({
    ref,
    type = 'text',
    hasError = false,
    style,
    onFocus,
    onBlur,
    editable = true,
    ...rest
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: FocusEvent) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: FocusEvent) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    let typeProps: TextInputProps = {};
    switch (type) {
        case 'email':
            typeProps = { keyboardType: 'email-address', autoCapitalize: 'none' };
            break;
        case 'password':
            typeProps = { secureTextEntry: true };
            break;
        case 'number':
            typeProps = { keyboardType: 'numeric' };
            break;
        case 'tel':
            typeProps = { keyboardType: 'phone-pad' };
            break;
        case 'url':
            typeProps = { keyboardType: 'url', autoCapitalize: 'none' };
            break;
        case 'search':
            typeProps = { returnKeyType: 'search' };
            break;
        default:
            break;
    }

    return (
        <TextInput
            ref={ref}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={colors.textMuted}
            style={[
                styles.input,
                isFocused && styles.focused,
                hasError && styles.hasError,
                !editable && styles.disabled,
                style,
            ]}
            {...typeProps}
            {...rest}
        />
    );
};

Input.displayName = 'Input';

const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingVertical: spacing.s3,
        paddingHorizontal: spacing.s4,
        borderWidth: 1,
        borderColor: colors.neutralLight,
        borderRadius: borderRadius.md,
        fontSize: fontSizes.sm,
        color: colors.text,
        backgroundColor: colors.background,
        marginBottom: spacing.sm,
    },
    focused: {
        borderColor: colors.primary,
    },
    disabled: {
        backgroundColor: colors.neutralLight,
        color: colors.textMuted,
        opacity: 0.7,
    },
    hasError: {
        borderColor: colors.error,
    },
} as const);

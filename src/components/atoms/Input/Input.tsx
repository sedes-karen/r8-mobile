import React, { useState } from 'react';
import { TextInput, type TextInputProps, type StyleProp, type TextStyle, type FocusEvent } from 'react-native';
import { styles } from './Input.style';
import { colors } from '../../../constants/design';

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

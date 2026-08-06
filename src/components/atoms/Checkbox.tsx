import React from 'react';
import { Pressable, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { colors, borderRadius } from '../../constants/design';
import { Text } from './Text';

export interface CheckboxProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function Checkbox({ value, onValueChange, disabled = false, style }: CheckboxProps) {
    return (
        <Pressable
            onPress={() => onValueChange(!value)}
            disabled={disabled}
            style={({ pressed }) => [
                styles.container,
                value && styles.checked,
                disabled && styles.disabled,
                pressed && !disabled && styles.pressed,
                style
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: value, disabled }}
        >
            {value && (
                <Text variant="small" style={styles.checkMark}>✓</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: colors.neutral,
        borderRadius: borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    checked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    disabled: {
        opacity: 0.5,
        backgroundColor: colors.neutralLight,
    },
    pressed: {
        opacity: 0.8,
    },
    checkMark: {
        color: colors.onPrimary,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/design';

export type CheckboxStatus = 'marked' | 'unmarked' | 'disabledMarked' | 'disabledUnmarked';

export interface CheckboxProps {
    id?: string;
    label?: string;
    status?: CheckboxStatus;
    onChange?: (newStatus: CheckboxStatus) => void;
}

export function Checkbox({ label, status = 'unmarked', onChange }: CheckboxProps) {
    const isChecked = status === 'marked' || status === 'disabledMarked';
    const isDisabled = status === 'disabledMarked' || status === 'disabledUnmarked';

    const handlePress = () => {
        if (isDisabled || !onChange) return;

        const nextStatus: CheckboxStatus = isChecked ? 'unmarked' : 'marked';
        onChange(nextStatus);
    };

    return (
        <Pressable
            onPress={handlePress}
            disabled={isDisabled}
            style={[styles.checkboxWrapper, isDisabled && styles.disabled]}
        >
            <View style={[styles.box, isChecked && styles.boxChecked, isDisabled && styles.boxDisabled]}>
                {isChecked && <Text style={[styles.checkmark, isDisabled && styles.checkmarkDisabled]}>✓</Text>}
            </View>
            {label ? (
                <Text style={[styles.checkboxLabel, isDisabled && styles.labelDisabled]}>
                    {label}
                </Text>
            ) : null}
        </Pressable>
    );
}

export default Checkbox;

const styles = StyleSheet.create({
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.sm,
    },
    disabled: {
        opacity: 0.6,
    },
    box: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: colors.primary.default,
        borderRadius: borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
        backgroundColor: colors.background,
    },
    boxChecked: {
        backgroundColor: colors.primary.default,
    },
    boxDisabled: {
        borderColor: colors.onSurface.variant,
        backgroundColor: 'transparent',
    },
    checkmark: {
        color: colors.primary.foreground,
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 16,
    },
    checkmarkDisabled: {
        color: colors.onSurface.variant,
    },
    checkboxLabel: {
        fontSize: 14,
        color: colors.onSurface.default,
    },
    labelDisabled: {
        color: colors.onSurface.variant,
    },
});
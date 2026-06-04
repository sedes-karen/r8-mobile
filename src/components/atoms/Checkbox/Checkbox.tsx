import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { styles } from './Checkbox.styles'; 

export type CheckboxStatus = 'marked' | 'unmarked' | 'disabledMarked' | 'disabledUnmarked';

interface CheckboxProps {
    id: string;
    label: string;
    status?: CheckboxStatus;
    onChange?: (newStatus: CheckboxStatus) => void;
}

export default function Checkbox({ label, status = 'unmarked', onChange }: CheckboxProps) {
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
            <Text style={[styles.checkboxLabel, isDisabled && styles.labelDisabled]}>
                {label}
            </Text>
        </Pressable>
    );
}
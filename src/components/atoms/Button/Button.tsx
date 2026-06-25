import React, { ReactNode } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle, type TextStyle, type PressableProps } from 'react-native';
import { styles } from './Button.style';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    style,
    textStyle,
    ...rest
}: ButtonProps) {
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];

    const textVariantStyle = styles[`${variant}Text`];
    const textSizeStyle = styles[`${size}Text`];

    const renderContent = () => {
        if (typeof children === 'string') {
            return (
                <Text style={[styles.content, textVariantStyle, textSizeStyle, textStyle]}>
                    {children}
                </Text>
            );
        }

        return children;
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.btn,
                variantStyle,
                sizeStyle,
                style,
                pressed && { opacity: 0.85 },
            ]}
            {...rest}
        >
            {renderContent()}
        </Pressable>
    );
}

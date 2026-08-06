import React from 'react';
import { Text as RNText, StyleSheet, type TextProps as RNTextProps, type TextStyle, type StyleProp } from 'react-native';
import { colors, fontSizes, fontWeights } from '../../constants/design';

export interface TextProps extends RNTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'p' | 'small' | 'label';
    size?: keyof typeof fontSizes;
    weight?: keyof typeof fontWeights;
    color?: keyof typeof colors;
    align?: TextStyle['textAlign'];
    style?: StyleProp<TextStyle>;
}

export function Text({
    variant = 'p',
    size,
    weight,
    color,
    align,
    style,
    children,
    ...rest
}: TextProps) {
    const baseStyle = variantStyles[variant];

    const overrideStyle: TextStyle = {};
    if (size) overrideStyle.fontSize = fontSizes[size];
    if (weight) overrideStyle.fontWeight = fontWeights[weight];
    if (color) overrideStyle.color = colors[color];
    if (align) overrideStyle.textAlign = align;

    return (
        <RNText style={[baseStyle, overrideStyle, style]} {...rest}>
            {children}
        </RNText>
    );
}

const variantStyles = StyleSheet.create({
    h1: {
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.bold,
        color: colors.text,
    },
    h2: {
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.bold,
        color: colors.text,
    },
    h3: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        color: colors.text,
    },
    p: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.normal,
        color: colors.text,
    },
    small: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.normal,
        color: colors.textMuted,
    },
    label: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        color: colors.text,
    }
});

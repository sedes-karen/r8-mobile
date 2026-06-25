import React, { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle, type PressableProps } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../../constants/design';

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

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: borderRadius.sm,
    },
    content: {
        fontWeight: fontWeights.semibold,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.background,
        borderColor: colors.neutralLight,
    },
    danger: {
        backgroundColor: colors.error,
    },
    success: {
        backgroundColor: colors.success,
    },
    primaryText: {
        color: colors.onPrimary,
    },
    secondaryText: {
        color: colors.text,
    },
    dangerText: {
        color: colors.onError,
    },
    successText: {
        color: colors.onPrimary,
    },
    sm: {
        paddingVertical: spacing.xs + spacing.px * 2,
        paddingHorizontal: spacing.s3,
    },
    md: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    lg: {
        paddingVertical: spacing.s3,
        paddingHorizontal: spacing.lg,
    },
    smText: {
        fontSize: 11,
    },
    mdText: {
        fontSize: fontSizes.xs,
    },
    lgText: {
        fontSize: fontSizes.sm,
    },
} as const);

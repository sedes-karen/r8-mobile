import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../../constants/design';

export type AvatarVariant = 'sm' | 'md' | 'lg';

interface AvatarProps {
    src?: string;
    alt?: string;
    variant?: AvatarVariant;
}

const AVATAR_SIZES: Record<AvatarVariant, number> = { //No se usaron los "sm", "md" y "lg" del design porque me parecieron muy chicos
    sm: spacing.xl,    
    md: spacing['3xl'], 
    lg: 96,             
};

// PNG transparente de 1x1 base64
const FALLBACK_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export default function Avatar({ src, variant = 'md' }: AvatarProps) {
    const pixelSize = AVATAR_SIZES[variant];
    const imageSrc = src || FALLBACK_IMAGE_BASE64;
    const hasNoSrc = !src;

    return (
        <View
            style={[
                styles.avatarContainer,
                {
                    width: pixelSize,
                    height: pixelSize,
                    borderRadius: borderRadius.full,
                },
                hasNoSrc && styles.fallbackBackground,
            ]}
        >
            <Image
                source={{ uri: imageSrc }}
                style={styles.avatarImage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        overflow: 'hidden',
        backgroundColor: colors.background,
    },
    fallbackBackground: {
        backgroundColor: '#ff0000',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
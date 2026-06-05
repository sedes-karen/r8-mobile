import { styles } from './Avatar.style';
import React from 'react';

import { View, Image } from 'react-native';

export type AvatarVariant = 'sm'|'md'|'lg';
interface AvatarProps {
    src?: string;
    alt?: string;
    variant?: AvatarVariant;
}

export default function Avatar({ src, variant = 'md' }: AvatarProps) {
    const sizeClass = styles[variant];

    const avatarSizes: Record<AvatarVariant, number> = {
        sm: 32,
        md: 56,
        lg: 96
    };
    const pixelSize = avatarSizes[variant];

    const imageSrc = src || `https://img.magnific.com/vector-premium/ilustracion-vectorial-capibara_792626-376.jpg?semt=ais_hybrid&w=740&q=80=${pixelSize}`;

    return (
        <View style={[styles.avatarContainer, sizeClass]}>
            <Image
                source={{ uri: imageSrc }}
                style={styles.avatarImage}
            />
        </View>
    );
}
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { styles } from './Spinner.style';

type SpinnerSize = 'sm' | 'md' | 'lg';

type SpinnerProps = {
    size?: SpinnerSize;
    label?: string;
};

export default function Spinner({ size = 'md', label = 'Cargando...' }: SpinnerProps) {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 850,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        );
        animation.start();
        return () => animation.stop();
    }, [rotation]);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={label}
        >
            <Animated.View
                style={[
                    styles.spinner,
                    styles[size],
                    { transform: [{ rotate: spin }] },
                ]}
            />
        </View>
    );
}


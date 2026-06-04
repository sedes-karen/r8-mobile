import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface Props { source?: string | null }

export default function Avatar({ source }: Props) {
  if (source) {
    return <Image source={{ uri: source }} style={styles.image} />;
  }
  return <View style={styles.placeholder} />;
}

const styles = StyleSheet.create({
  image: { width: 120, height: 120, borderRadius: 999 },
  placeholder: { width: 120, height: 120, borderRadius: 999, backgroundColor: '#cfd8dc' },
});

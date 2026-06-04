import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LabelSocialLinks as SocialLinks } from '../../types/label';

interface Props { social?: SocialLinks }

export default function LabelSocialLinks({ social }: Props) {
  if (!social) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redes</Text>
      {social.website ? <Text style={styles.link}>{social.website}</Text> : null}
      {social.instagram ? <Text style={styles.link}>@{social.instagram}</Text> : null}
      {social.facebook ? <Text style={styles.link}>{social.facebook}</Text> : null}
      {social.twitter ? <Text style={styles.link}>@{social.twitter}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  title: { fontSize: 16, fontWeight: '700' },
  link: { marginTop: 8, color: '#1a73e8' },
});

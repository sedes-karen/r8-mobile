import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LabelProfile } from '../../types/label';
import Avatar from '../atoms/Avatar';
import LabelSocialLinks from '../molecules/LabelSocialLinks';

interface Props { profile: LabelProfile }

export default function LabelProfileSection({ profile }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarRow}>
        <Avatar source={profile.avatarUrl} />
      </View>

      <Text style={styles.name}>{profile.name}</Text>
      {profile.description ? <Text style={styles.description}>{profile.description}</Text> : null}

      <View style={styles.info}>
        {profile.website ? <Text style={styles.infoLine}>Sitio: {profile.website}</Text> : null}
        {profile.email ? <Text style={styles.infoLine}>Email: {profile.email}</Text> : null}
        {profile.phone ? <Text style={styles.infoLine}>Tel: {profile.phone}</Text> : null}
      </View>

      <LabelSocialLinks social={profile.social} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  avatarRow: { alignItems: 'center' },
  name: { marginTop: 12, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  description: { marginTop: 8, fontSize: 15, color: '#444', textAlign: 'center' },
  info: { marginTop: 16 },
  infoLine: { fontSize: 14, color: '#333', marginTop: 6 },
});

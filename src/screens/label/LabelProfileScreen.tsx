import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getLabelMe, getLabelProfileImage } from '../../services/api/labelsService';
import { LabelProfile } from '../../types/label';
import LabelProfileSection from '../../components/organisms/LabelProfileSection';

export default function LabelProfileScreen() {
  const [profile, setProfile] = useState<LabelProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const label = await getLabelMe();
        const image = await getLabelProfileImage();
        if (!mounted) return;
        setProfile({ ...label, avatarUrl: image?.url ?? null });
      } catch (e) {
        if (!mounted) return;
        setError('No se pudieron cargar los datos del perfil');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.msg}>Cargando perfil...</Text>
          </View>
        )}

        {error && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        {!loading && !error && profile && <LabelProfileSection profile={profile} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  center: { marginTop: 32, alignItems: 'center' },
  msg: { marginTop: 12, fontSize: 16, color: '#555' },
  error: { fontSize: 16, color: '#b00020', textAlign: 'center' },
});

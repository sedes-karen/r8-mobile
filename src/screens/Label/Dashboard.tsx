import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle } from '../../components/atoms/ScreenTitle';
import { ListRowCard } from '../../components/molecules/ListRowCard';
import { AppText } from '../../components/atoms/AppText';
import { colors, spacing } from '../../constants/design';
import type { ReleaseListItem } from '../../types/release';

const BASE_URL = 'https://api-stage.technopremieres.com'; 

const MOCK_RELEASES: ReleaseListItem[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    title: 'EP Demo Label',
    artist: 'Artista X',
    type: 'EP',
    releaseDate: '2026-05-01T00:00:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    title: 'Album de Prueba',
    artist: 'Artista Y',
    type: 'ALBUM',
    releaseDate: '2025-11-15T00:00:00.000Z',
  },
];

export const LabelDashboardScreen = () => {
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');
  const [releases, setReleases] = useState<ReleaseListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const loadDashboardData = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch(`${BASE_URL}/releases`, {
        headers: { Accept: 'application/json' },
      });
      
      if (!res.ok) {
        throw new Error(`Status: ${res.status}`);
      }
      
      const data = (await res.json()) as ReleaseListItem[];
      
      if (data.length === 0) {
        setStatus('empty');
      } else {
        setReleases(data);
        setStatus('success');
      }
    } catch (error) {
      console.warn('La API falló. Cargando datos mockeados de respaldo...', error);
      
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (MOCK_RELEASES.length === 0) {
        setStatus('empty');
      } else {
        setReleases([...MOCK_RELEASES]);
        setStatus('success');
      }
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatSubtitle = (item: ReleaseListItem) => {
    const year = item.releaseDate.slice(0, 4);
    return `${item.type} · ${year}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <ScreenTitle
          title="Dashboard"
          subtitle="Catálogo del label"
        />
      </View>

      {status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText variant="body" style={styles.loadingText}>Cargando catálogo...</AppText>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.center}>
          <AppText variant="body" style={styles.errorText}>{errorMessage}</AppText>
          <Button title="Reintentar" onPress={loadDashboardData} color={colors.primary} />
        </View>
      )}

      {status === 'empty' && (
        <View style={styles.center}>
          <AppText variant="body">No hay lanzamientos cargados en este label.</AppText>
        </View>
      )}

      {status === 'success' && (
        <FlatList
          data={releases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListRowCard
              title={`${item.title} — ${item.artist}`}
              subtitle={formatSubtitle(item)}
              onPress={() => {
                console.log('Navegar al release:', item.id);
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background, 
  },
  header: {
    paddingHorizontal: spacing.md, 
    paddingTop: spacing.sm,        
  },
  list: {
    padding: spacing.md,           
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,          
  },
  loadingText: {
    marginTop: spacing.sm,         
  },
  errorText: {
    color: colors.error,          
    marginBottom: spacing.sm,     
  },
});
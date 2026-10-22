import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { ArtistPromosDetailsScreen } from './Details';
import * as api from '../../../services/api/promoDetailApi';
import type { PromoDetail } from '../../../types/promos/detail';
import type { ReleaseDetail } from '../../../types/releases/releaseDetail';

// --- Categoría: Mocks de Navegación, Componentes y Audio ---

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { promoId: 'promo-test-1' } }),
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('../../../components/atoms/LinkButton', () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({
    playing: false,
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
  }),
}));

// --- Categoría: Datos de Prueba ---

const MOCK_PROMO: PromoDetail = {
  id: 'promo-test-1',
  status: 'SENT',
  isActive: true,
  scheduledAt: null,
  sentAt: '2026-09-01T00:00:00Z',
  expiresAt: null,
  release: {
    id: 'release-test-1',
    title: 'Test Album Title',
    artistName: 'Test Artist Name',
    labelName: 'Test Label Records',
    catalogNumber: 'TEST-001',
    releaseDate: '2026-09-10',
    type: 'EP',
    notes: 'Nota importante del release para prueba',
  },
};

const MOCK_RELEASE: ReleaseDetail = {
  id: 'release-test-1',
  title: 'Test Album Title',
  artist: 'Test Artist Name',
  coverUrl: 'https://example.com/cover.jpg',
  notes: 'Nota importante del release para prueba',
  releaseDate: '2026-09-10',
  tracks: [
    {
      id: 'track-1',
      title: 'Cancion Uno',
      trackNumber: 1,
      duration: 185,
      audioUrl: 'https://example.com/audio1.mp3',
    },
    {
      id: 'track-2',
      title: 'Cancion Dos',
      trackNumber: 2,
      duration: 210,
      audioUrl: 'https://example.com/audio2.mp3',
    },
  ],
};

// --- Categoría: Tests ---

describe('ArtistPromosDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra la cabecera, metadatos y notas del release tras cargar', async () => {
    jest.spyOn(api, 'getPromoDetail').mockResolvedValue(MOCK_PROMO);
    jest.spyOn(api, 'getReleaseWithTracks').mockResolvedValue(MOCK_RELEASE);

    const { getByText } = await render(<ArtistPromosDetailsScreen />);

    await waitFor(() => {
      expect(getByText('Test Album Title')).toBeTruthy();
      expect(getByText('Test Artist Name')).toBeTruthy();
      expect(getByText('Label: Test Label Records')).toBeTruthy();
      expect(getByText('Catálogo: TEST-001')).toBeTruthy();
      expect(getByText('Notas: Nota importante del release para prueba')).toBeTruthy();
    });
  });

  it('lista las canciones con sus titulos correspondientes', async () => {
    jest.spyOn(api, 'getPromoDetail').mockResolvedValue(MOCK_PROMO);
    jest.spyOn(api, 'getReleaseWithTracks').mockResolvedValue(MOCK_RELEASE);

    const { getAllByText, getByText } = await render(<ArtistPromosDetailsScreen />);

    await waitFor(() => {
      expect(getAllByText('Cancion Uno').length).toBeGreaterThan(0);
      expect(getByText('Cancion Dos')).toBeTruthy();
      expect(getByText('Pistas (2)')).toBeTruthy();
    });
  });

  it('abre el modal al tocar el boton de descarte y cancela correctamente', async () => {
    jest.spyOn(api, 'getPromoDetail').mockResolvedValue(MOCK_PROMO);
    jest.spyOn(api, 'getReleaseWithTracks').mockResolvedValue(MOCK_RELEASE);

    const { getByText, queryByText } = await render(<ArtistPromosDetailsScreen />);

    await waitFor(() => {
      expect(getByText('🗑️')).toBeTruthy();
    });

    await fireEvent.press(getByText('🗑️'));

    await waitFor(() => {
      expect(getByText('¿Descartar esta promo?')).toBeTruthy();
      expect(getByText('La promo dejará de aparecer en tu bandeja de entrada.')).toBeTruthy();
    });

    await fireEvent.press(getByText('Cancelar'));

    await waitFor(() => {
      expect(queryByText('¿Descartar esta promo?')).toBeNull();
    });
  });
});

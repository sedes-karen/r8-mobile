import { fireEvent, render } from '@testing-library/react-native';
import { ArtistPromosFeedbackScreen } from './Feedback';
import * as useRecipientFeedbackModule from '../../../features/feedback/useRecipientFeedback';
import * as useFeedbackFormModule from '../../../features/feedback/useFeedbackForm';
import type { FeedbackEntity, FeedbackFormValues } from '../../../types/feedback/form';
import type { PromoDetail } from '../../../types/promo';
import type { ReleaseTrack } from '../../../types/releases';

jest.mock('../../../features/feedback/useRecipientFeedback');
jest.mock('../../../components/atoms/LinkButton', () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => children,
}));

const PROMO: PromoDetail = {
  id: 'promo-1',
  status: 'SENT',
  isActive: true,
  useCuratedDb: false,
  scheduledAt: null,
  release: {
    id: 'release-1',
    title: 'Rpruebas Test Release',
    artistName: 'Rpruebas Artist',
    labelName: 'Rpruebas Label',
    catalogNumber: 'RP-001',
    artwork: null,
    releaseDate: null,
    type: 'EP',
    notes: null,
  },
};

const TRACKS: ReleaseTrack[] = [
  { id: 'track-1', title: 'Rpruebas Track 1', trackNumber: 1, duration: 212, audioUrl: null },
];

function feedbackWith(rating: number | null): FeedbackEntity {
  return {
    id: 'feedback-1',
    releaseId: 'release-1',
    userId: 'user-1',
    rating,
    comment: rating === null ? null : 'Buenísimo',
    willPlay: rating === null ? null : true,
    supported: true,
    trackStats: [],
  };
}

const EMPTY_VALUES: FeedbackFormValues = {
  rating: null,
  comment: '',
  willPlay: null,
  supported: null,
};

function mockData(
  overrides: Partial<ReturnType<typeof useRecipientFeedbackModule.useRecipientFeedback>> = {},
) {
  jest
    .spyOn(useRecipientFeedbackModule, 'useRecipientFeedback')
    .mockReturnValue({
      status: 'success',
      reload: jest.fn(),
      data: { promo: PROMO, tracks: TRACKS, feedback: feedbackWith(null), userId: 'user-1' },
      promo: PROMO,
      tracks: TRACKS,
      feedback: feedbackWith(null),
      canSubmitFeedback: true,
      trackStats: { 'track-1': { playCount: 2, liked: false, downloaded: false } },
      statsPending: null,
      statsError: null,
      registerPlay: jest.fn(),
      toggleLike: jest.fn(),
      registerDownload: jest.fn(),
      ...overrides,
    } as unknown as ReturnType<typeof useRecipientFeedbackModule.useRecipientFeedback>);
}

function mockForm(overrides: Partial<ReturnType<typeof useFeedbackFormModule.useFeedbackForm>> = {}) {
  jest.spyOn(useFeedbackFormModule, 'useFeedbackForm').mockReturnValue({
    values: EMPTY_VALUES,
    errors: {},
    submitAttempted: false,
    submitting: false,
    error: null,
    submitted: null,
    setRating: jest.fn(),
    setComment: jest.fn(),
    setWillPlay: jest.fn(),
    setSupported: jest.fn(),
    submit: jest.fn(),
    ...overrides,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockData();
  mockForm();
});

describe('ArtistPromosFeedbackScreen', () => {
  it('muestra el contexto de la promo', async () => {
    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('Rpruebas Test Release')).toBeTruthy();
    expect(getByText('Rpruebas Label')).toBeTruthy();
    expect(getByText('Enviada')).toBeTruthy();
  });

  it('pide el promoId por la ruta', async () => {
    await render(<ArtistPromosFeedbackScreen />);

    expect(useRecipientFeedbackModule.useRecipientFeedback).toHaveBeenCalledWith(undefined);
  });

  it('muestra un error propio cuando no llegó el promoId', async () => {
    const { getByText } = await render(<ArtistPromosFeedbackScreen />);

    expect(getByText('No pudimos identificar la promo de este formulario')).toBeTruthy();
  });

  it('muestra el loading mientras se piden los datos', async () => {
    mockData({
      status: 'loading',
    } as Partial<ReturnType<typeof useRecipientFeedbackModule.useRecipientFeedback>>);

    const { getByText, queryByText } = await render(
      <ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />,
    );

    expect(getByText('Cargando promo...')).toBeTruthy();
    expect(queryByText('Enviar feedback')).toBeNull();
  });

  it('muestra el error de carga con su reintento', async () => {
    mockData({
      status: 'error',
      message: 'No se pudo cargar la promo',
    } as Partial<ReturnType<typeof useRecipientFeedbackModule.useRecipientFeedback>>);

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('No se pudo cargar la promo')).toBeTruthy();
    expect(getByText('Reintentar')).toBeTruthy();
  });

  it('envía el formulario con el releaseId y feedbackId del ensure', async () => {
    const submit = jest.fn();
    mockForm({ submit });

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);
    await fireEvent.press(getByText('Enviar feedback'));

    expect(submit).toHaveBeenCalledWith('release-1', 'feedback-1');
  });

  it('muestra los errores de validación del formulario', async () => {
    mockForm({ errors: { rating: 'Elegí una calificación de 1 a 5.' } });

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('Elegí una calificación de 1 a 5.')).toBeTruthy();
  });

  it('muestra el error del envío cuando la API lo rechaza', async () => {
    mockForm({ error: 'No se pudo enviar el feedback' });

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('No se pudo enviar el feedback')).toBeTruthy();
  });

  it('bloquea el formulario cuando la promo ya tiene rating', async () => {
    mockData({
      data: { promo: PROMO, tracks: TRACKS, feedback: feedbackWith(4), userId: 'user-1' },
      canSubmitFeedback: false,
    } as Partial<ReturnType<typeof useRecipientFeedbackModule.useRecipientFeedback>>);

    const { getByText, queryByText } = await render(
      <ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />,
    );

    expect(getByText('Ya enviaste tu feedback')).toBeTruthy();
    expect(getByText('Buenísimo')).toBeTruthy();
    expect(queryByText('Enviar feedback')).toBeNull();
  });

  it('confirma con un mensaje visual después de enviar', async () => {
    mockForm({ submitted: feedbackWith(5) });

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('Feedback enviado')).toBeTruthy();
  });

  it('muestra las estadísticas de la pista y dispara la acción de play', async () => {
    const registerPlay = jest.fn();
    mockData({ registerPlay });

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('Reproducciones: 2')).toBeTruthy();
    await fireEvent.press(getByText('+1 reproducción'));

    expect(registerPlay).toHaveBeenCalledWith('track-1');
  });

  it('muestra el error de una estadística fallida', async () => {
    mockData({ statsError: 'No se pudo registrar la descarga' });

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('No se pudo registrar la descarga')).toBeTruthy();
  });

  it('avisa cuando el release no tiene pistas', async () => {
    mockData({
      data: { promo: PROMO, tracks: [], feedback: feedbackWith(null), userId: 'user-1' },
      tracks: [],
      trackStats: {},
    } as Partial<ReturnType<typeof useRecipientFeedbackModule.useRecipientFeedback>>);

    const { getByText } = await render(<ArtistPromosFeedbackScreen route={{ params: { promoId: 'promo-1' } }} />);

    expect(getByText('Este release no tiene pistas cargadas.')).toBeTruthy();
  });
});

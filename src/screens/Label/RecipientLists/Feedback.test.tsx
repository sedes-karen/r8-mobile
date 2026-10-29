import { render } from '@testing-library/react-native';
import { LabelRecipientListsFeedbackScreen } from './Feedback';
import * as useLabelFeedbackModule from '../../../features/feedback/useLabelFeedback';
import type { LabelFeedbackData } from '../../../features/feedback/useLabelFeedback';

jest.mock('../../../features/feedback/useLabelFeedback');

const DATA: LabelFeedbackData = {
  list: {
    total: 2,
    feedback: [
      {
        id: 'f1',
        releaseId: 'r1',
        userId: 'u1',
        rating: 4,
        comment: 'Muy buen track',
        willPlay: true,
        supported: true,
        status: 'PENDING',
        trackStats: [],
        createdAt: '2026-09-01T12:00:00.000Z',
        release: { title: 'Rpruebas Test Release' },
      },
      {
        id: 'f2',
        releaseId: 'r1',
        userId: 'u2',
        rating: null,
        comment: null,
        willPlay: null,
        supported: false,
        status: 'PENDING',
        trackStats: [],
        createdAt: '2026-09-02T12:00:00.000Z',
      },
    ],
  },
  pending: { count: 3 },
  analytics: {
    overall: { totalFeedback: 1, averageRating: 4, supportRate: 50, responseRate: 0, recentFeedback: 1 },
    byRelease: [],
  },
};

function mockState(state: ReturnType<typeof useLabelFeedbackModule.useLabelFeedback>) {
  jest.spyOn(useLabelFeedbackModule, 'useLabelFeedback').mockReturnValue(state);
}

describe('LabelRecipientListsFeedbackScreen', () => {
  it('muestra el error del hook', async () => {
    mockState({ status: 'error', message: 'No se pudo cargar el feedback', reload: jest.fn() });
    const { getByText } = await render(<LabelRecipientListsFeedbackScreen />);
    expect(getByText('No se pudo cargar el feedback')).toBeTruthy();
  });

  it('muestra las métricas y las filas del listado', async () => {
    mockState({ status: 'success', data: DATA, reload: jest.fn() });
    const { getByText } = await render(<LabelRecipientListsFeedbackScreen />);
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4.0')).toBeTruthy();
    expect(getByText('Rpruebas Test Release')).toBeTruthy();
    expect(getByText('★ 4/5 · Support · Lo va a pasar')).toBeTruthy();
    expect(getByText('Muy buen track')).toBeTruthy();
  });

  it('distingue el feedback que todavía no se respondió', async () => {
    mockState({ status: 'success', data: DATA, reload: jest.fn() });
    const { getByText } = await render(<LabelRecipientListsFeedbackScreen />);
    expect(getByText('Release sin título')).toBeTruthy();
    expect(getByText('Sin respuesta todavía')).toBeTruthy();
  });

  it('muestra un EmptyState cuando no hay feedback', async () => {
    mockState({
      status: 'success',
      data: { ...DATA, list: { total: 0, feedback: [] } },
      reload: jest.fn(),
    });
    const { getByText } = await render(<LabelRecipientListsFeedbackScreen />);
    expect(getByText('Todavía no recibiste feedback de ninguna promo.')).toBeTruthy();
  });
});

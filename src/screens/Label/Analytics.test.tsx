import { render } from '@testing-library/react-native';
import { LabelAnalyticsScreen } from './Analytics';
import * as useLabelAnalyticsModule from '../../features/analytics/useLabelAnalytics';
import type { LabelAnalytics } from '../../types/analytics';

jest.mock('../../features/analytics/useLabelAnalytics');

const ANALYTICS: LabelAnalytics = {
  overall: { totalFeedback: 1, averageRating: 5, supportRate: 100, responseRate: 0, recentFeedback: 1 },
  byRelease: [
    { releaseId: 'r1', releaseTitle: 'Rpruebas Test Release', feedbackCount: 1, averageRating: 5, supportRate: 100 },
  ],
};

function mockState(state: ReturnType<typeof useLabelAnalyticsModule.useLabelAnalytics>) {
  jest.spyOn(useLabelAnalyticsModule, 'useLabelAnalytics').mockReturnValue(state);
}

describe('LabelAnalyticsScreen', () => {
  it('muestra el error del hook', async () => {
    mockState({ status: 'error', message: 'No se pudieron cargar las estadísticas', reload: jest.fn() });
    const { getByText } = await render(<LabelAnalyticsScreen />);
    expect(getByText('No se pudieron cargar las estadísticas')).toBeTruthy();
  });

  it('muestra las stats generales y la fila por release', async () => {
    mockState({ status: 'success', data: ANALYTICS, reload: jest.fn() });
    const { getByText } = await render(<LabelAnalyticsScreen />);
    expect(getByText('Rpruebas Test Release')).toBeTruthy();
    expect(getByText('5.0')).toBeTruthy();
  });

  it('muestra un EmptyState cuando no hay releases con feedback', async () => {
    mockState({
      status: 'success',
      data: { ...ANALYTICS, byRelease: [] },
      reload: jest.fn(),
    });
    const { getByText } = await render(<LabelAnalyticsScreen />);
    expect(getByText('Todavía no hay feedback para mostrar por release.')).toBeTruthy();
  });
});

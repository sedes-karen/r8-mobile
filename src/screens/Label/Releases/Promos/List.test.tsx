import { render } from '@testing-library/react-native';
import { LabelReleasesPromosListScreen } from './List';
import * as usePromosForLabelModule from '../../../../features/promos/usePromosForLabel';
import type { PromoForLabelItem } from '../../../../types/promos';

jest.mock('../../../../features/promos/usePromosForLabel');

const PROMO: PromoForLabelItem = {
  id: 'promo-1',
  labelId: 'label-1',
  releaseId: 'release-1',
  release: { id: 'release-1', title: 'Rpruebas Test Release', catalogNumber: 'RPR001', artistName: 'Rpruebas Artist', coverUrl: 'https://example.com/art.png' },
  scheduledAt: null,
  sentAt: '2026-08-27T10:40:46.136Z',
  status: 'SENT',
  isActive: true,
  feedbackCount: 1,
  averageRating: 5,
};

function mockState(state: ReturnType<typeof usePromosForLabelModule.usePromosForLabel>) {
  jest.spyOn(usePromosForLabelModule, 'usePromosForLabel').mockReturnValue(state);
}

describe('LabelReleasesPromosListScreen', () => {
  it('muestra el error del hook', async () => {
    mockState({ status: 'error', message: 'No se pudieron cargar las promos', reload: jest.fn() });
    const { getByText } = await render(<LabelReleasesPromosListScreen />);
    expect(getByText('No se pudieron cargar las promos')).toBeTruthy();
  });

  it('muestra un EmptyState cuando no hay promos', async () => {
    mockState({ status: 'success', data: [], reload: jest.fn() });
    const { getByText } = await render(<LabelReleasesPromosListScreen />);
    expect(getByText('Todavía no enviaste ninguna promo.')).toBeTruthy();
  });

  it('muestra la promo y el botón deshabilitado de Nueva promo', async () => {
    mockState({ status: 'success', data: [PROMO], reload: jest.fn() });
    const { getByText } = await render(<LabelReleasesPromosListScreen />);
    expect(getByText('Rpruebas Test Release')).toBeTruthy();
    expect(getByText('Nueva promo')).toBeTruthy();
  });
});

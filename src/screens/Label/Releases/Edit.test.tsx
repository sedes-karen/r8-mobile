import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { LabelReleasesEditScreen } from './Edit';
import * as releasesApi from '../../../services/api/releasesApi';
import type { ReleaseDetail } from '../../../types/releases';

jest.mock('../../../services/api/releasesApi');

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoBack }),
}));

const RELEASE: ReleaseDetail = {
  id: 'release-1',
  title: 'EP Demo',
  artist: 'Artista X',
  type: 'EP',
  releaseDate: '2026-05-01',
  catalogNumber: 'R8-001',
  status: 'CREATED',
  tracks: [],
};

const route = { params: { releaseId: 'release-1' } };

beforeEach(() => {
  mockGoBack.mockClear();
  jest.mocked(releasesApi.fetchReleaseById).mockResolvedValue(RELEASE);
  jest.mocked(releasesApi.updateRelease).mockResolvedValue(RELEASE);
});

describe('LabelReleasesEditScreen', () => {
  it('muestra el loading mientras carga', async () => {
    jest.mocked(releasesApi.fetchReleaseById).mockReturnValue(new Promise<ReleaseDetail>(() => {}));
    const { getByText } = await render(<LabelReleasesEditScreen route={route} />);
    expect(getByText('Cargando release...')).toBeTruthy();
  });

  it('precarga los datos actuales del release', async () => {
    const { getByDisplayValue } = await render(<LabelReleasesEditScreen route={route} />);
    await waitFor(() => expect(getByDisplayValue('EP Demo')).toBeTruthy());
    expect(getByDisplayValue('Artista X')).toBeTruthy();
    expect(getByDisplayValue('2026-05-01')).toBeTruthy();
  });

  it('valida que el título no quede vacío antes de enviar', async () => {
    const { getByDisplayValue, getByText } = await render(<LabelReleasesEditScreen route={route} />);
    const titleInput = await waitFor(() => getByDisplayValue('EP Demo'));
    await fireEvent.changeText(titleInput, '');
    await fireEvent.press(getByText('Guardar cambios'));
    expect(getByText('El título es obligatorio')).toBeTruthy();
    expect(releasesApi.updateRelease).not.toHaveBeenCalled();
  });

  it('muestra la confirmación y vuelve atrás al guardar', async () => {
    jest.useFakeTimers();
    try {
      const { getByDisplayValue, getByText, queryByRole } = await render(<LabelReleasesEditScreen route={route} />);
      await waitFor(() => expect(getByDisplayValue('EP Demo')).toBeTruthy());
      await fireEvent.press(getByText('Guardar cambios'));
      await waitFor(() => expect(getByText('Cambios guardados')).toBeTruthy());
      // El éxito ya no se muestra como error (ErrorMessage usa accessibilityRole="alert").
      expect(queryByRole('alert')).toBeNull();
      act(() => {
        jest.advanceTimersByTime(1200);
      });
      expect(mockGoBack).toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
    }
  });
});

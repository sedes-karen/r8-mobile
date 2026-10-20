import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { LabelReleasesNewScreen } from './New';
import { createRelease } from '../../../services/api/releasesApi';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));
jest.mock('../../../services/api/releasesApi');

const mockedCreateRelease = jest.mocked(createRelease);

/** Los inputs no tienen label accesible propio; arrancan vacíos y en orden título, artista, fecha. */
async function renderScreen() {
  const screen = await render(<LabelReleasesNewScreen />);
  const [title, artist, releaseDate] = screen.getAllByDisplayValue('');
  return { screen, title, artist, releaseDate };
}

describe('LabelReleasesNewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('con el formulario vacío muestra errores por campo y no llama a la API', async () => {
    const { screen } = await renderScreen();
    await fireEvent.press(screen.getByText('Crear release'));

    expect(screen.getByText('El título es obligatorio')).toBeTruthy();
    expect(screen.getByText('El artista es obligatorio')).toBeTruthy();
    expect(mockedCreateRelease).not.toHaveBeenCalled();
  });

  it('trata un título con solo espacios como vacío y rechaza fechas inexistentes', async () => {
    const { screen, title, artist, releaseDate } = await renderScreen();
    await fireEvent.changeText(title, '   ');
    await fireEvent.changeText(artist, 'Artista');
    await fireEvent.changeText(releaseDate, '2026-02-30');
    await fireEvent.press(screen.getByText('Crear release'));

    expect(screen.getByText('El título es obligatorio')).toBeTruthy();
    expect(screen.getByText('Usá el formato AAAA-MM-DD (ej: 2026-11-20)')).toBeTruthy();
    expect(mockedCreateRelease).not.toHaveBeenCalled();
  });

  it('con datos válidos envía el body recortado con el tipo elegido y vuelve atrás', async () => {
    mockedCreateRelease.mockResolvedValue({
      id: 'release-1',
      title: 'Mi EP',
      artist: 'Artista',
      type: 'ALBUM',
      releaseDate: '2026-11-20',
    });
    const { screen, title, artist, releaseDate } = await renderScreen();
    await fireEvent.changeText(title, '  Mi EP  ');
    await fireEvent.changeText(artist, ' Artista ');
    await fireEvent.changeText(releaseDate, '2026-11-20');
    await fireEvent.press(screen.getByText('Álbum'));
    await fireEvent.press(screen.getByText('Crear release'));

    expect(mockedCreateRelease).toHaveBeenCalledWith({
      title: 'Mi EP',
      artist: 'Artista',
      type: 'ALBUM',
      releaseDate: '2026-11-20',
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('si la API falla muestra el mensaje del servidor y no vuelve atrás', async () => {
    mockedCreateRelease.mockRejectedValue(new Error('No se pudo crear el release'));
    const { screen, title, artist } = await renderScreen();
    await fireEvent.changeText(title, 'Mi EP');
    await fireEvent.changeText(artist, 'Artista');
    await fireEvent.press(screen.getByText('Crear release'));

    await waitFor(() => expect(screen.getByText('No se pudo crear el release')).toBeTruthy());
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});

import { cleanup, fireEvent, render, screen } from '@testing-library/react-native';
import { ReleaseForm } from './ReleaseForm';

const props = {
  title: 'EP Demo',
  artist: 'Artista X',
  type: 'EP' as const,
  releaseDate: '2026-05-01',
  onChangeTitle: jest.fn(),
  onChangeArtist: jest.fn(),
  onChangeType: jest.fn(),
  onChangeReleaseDate: jest.fn(),
  onSubmit: jest.fn(),
};

async function renderForm() {
  await render(<ReleaseForm {...props} />);
  return props;
}

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('ReleaseForm', () => {
  it('expone etiquetas accesibles en los campos del formulario', async () => {
    await renderForm();

    expect(screen.getByLabelText('Título del release')).toBeTruthy();
    expect(screen.getByLabelText('Artista del release')).toBeTruthy();
    expect(screen.getByLabelText('Fecha de release')).toBeTruthy();
    expect(screen.getByDisplayValue('EP Demo')).toBeTruthy();
  });

  it('avisa los cambios de cada campo por su callback', async () => {
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Título del release'), 'Nuevo título');
    await fireEvent.changeText(screen.getByLabelText('Artista del release'), 'Nuevo artista');
    await fireEvent.changeText(screen.getByLabelText('Fecha de release'), '2026-12-01');

    expect(props.onChangeTitle).toHaveBeenCalledWith('Nuevo título');
    expect(props.onChangeArtist).toHaveBeenCalledWith('Nuevo artista');
    expect(props.onChangeReleaseDate).toHaveBeenCalledWith('2026-12-01');
  });

  it('envía al presionar el botón', async () => {
    await renderForm();

    await fireEvent.press(screen.getByText('Guardar cambios'));

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('muestra el aviso de éxito con SuccessNotice', async () => {
    await render(<ReleaseForm {...props} successMessage="Cambios guardados" />);

    expect(screen.getByText('Cambios guardados')).toBeTruthy();
  });
});

import { fireEvent, render } from '@testing-library/react-native';
import { LabelProfileViewScreen } from './View';
import * as useLabelProfileModule from '../../../features/label/useLabelProfile';
import * as authInfoModule from '../../../features/auth/info';
import type { LabelProfile } from '../../../types/label';

jest.mock('../../../features/label/useLabelProfile');
jest.mock('../../../features/auth/info');

const LABEL: LabelProfile = {
  id: 'label-1',
  userId: 'user-1',
  name: 'Rpruebas Records',
  description: 'Sello de prueba',
  profileImagePath: null,
  profileImageUrl: null,
  instagramUrl: 'https://instagram.com/rpruebas',
  soundcloudUrl: 'https://soundcloud.com/rpruebas',
  bandcampUrl: null,
  twitterUrl: null,
  createdAt: '2026-08-27T00:00:00.000Z',
  updatedAt: '2026-08-27T00:00:00.000Z',
};

function mockState(state: ReturnType<typeof useLabelProfileModule.useLabelProfile>) {
  jest.spyOn(useLabelProfileModule, 'useLabelProfile').mockReturnValue(state);
}

const logout = jest.fn();

beforeEach(() => {
  logout.mockClear();
  jest.spyOn(authInfoModule, 'useAuthActions').mockReturnValue({
    logout,
    loginDev: jest.fn(),
    applySession: jest.fn(),
  });
});

describe('LabelProfileViewScreen', () => {
  it('muestra el loading mientras carga', async () => {
    mockState({ status: 'loading', reload: jest.fn() });
    const { queryByText } = await render(<LabelProfileViewScreen />);
    expect(queryByText('Cargando perfil...')).toBeTruthy();
  });

  it('muestra el error del hook', async () => {
    mockState({ status: 'error', message: 'No se pudo cargar el perfil del label', reload: jest.fn() });
    const { getByText } = await render(<LabelProfileViewScreen />);
    expect(getByText('No se pudo cargar el perfil del label')).toBeTruthy();
  });

  it('muestra el nombre, la descripción y las redes', async () => {
    mockState({ status: 'success', data: LABEL, reload: jest.fn() });
    const { getByText } = await render(<LabelProfileViewScreen />);
    expect(getByText('Rpruebas Records')).toBeTruthy();
    expect(getByText('Sello de prueba')).toBeTruthy();
    expect(getByText('https://instagram.com/rpruebas')).toBeTruthy();
    expect(getByText('https://soundcloud.com/rpruebas')).toBeTruthy();
  });

  it('muestra "—" en los campos sin valor', async () => {
    mockState({ status: 'success', data: LABEL, reload: jest.fn() });
    const { getAllByText } = await render(<LabelProfileViewScreen />);
    expect(getAllByText('—')).toHaveLength(2);
  });

  it('llama a logout al tocar Cerrar sesión', async () => {
    mockState({ status: 'success', data: LABEL, reload: jest.fn() });
    const { getByText } = await render(<LabelProfileViewScreen />);
    await fireEvent.press(getByText('Cerrar sesión'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});

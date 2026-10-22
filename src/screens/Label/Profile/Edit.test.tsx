import { fireEvent, render } from '@testing-library/react-native';
import type { LabelProfile } from '../../../types/label';
import { LabelProfileEditScreen } from './Edit';
import * as useLabelProfileModule from '../../../features/label/useLabelProfile';
import * as useUpdateLabelProfileModule from '../../../features/label/useUpdateLabelProfile';
import * as useLabelImageModule from '../../../features/label/useLabelImage';
import * as useChangePasswordModule from '../../../features/label/useChangePassword';
import * as authInfoModule from '../../../features/auth/info';
import type { UpdateLabelProfileInput } from '../../../types/label';

jest.mock('../../../features/label/useLabelProfile');
jest.mock('../../../features/label/useUpdateLabelProfile');
jest.mock('../../../features/label/useLabelImage');
jest.mock('../../../features/label/useChangePassword');
jest.mock('../../../features/auth/info');
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

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

const submit = jest.fn(async (_input: UpdateLabelProfileInput) => true);
const uploadImage = jest.fn(async (_uri: string, _contentType: string) => true);
const changePassword = jest.fn(async (_currentPassword: string, _newPassword: string) => true);

function mockProfile(state: ReturnType<typeof useLabelProfileModule.useLabelProfile>) {
  jest.spyOn(useLabelProfileModule, 'useLabelProfile').mockReturnValue(state);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockProfile({ status: 'success', data: LABEL, reload: jest.fn() });
  jest.spyOn(useUpdateLabelProfileModule, 'useUpdateLabelProfile').mockReturnValue({
    submit,
    loading: false,
    error: null,
  });
  jest.spyOn(useLabelImageModule, 'useLabelImage').mockReturnValue({
    uploadImage,
    loading: false,
    error: null,
  });
  jest.spyOn(useChangePasswordModule, 'useChangePassword').mockReturnValue({
    changePassword,
    loading: false,
    error: null,
  });
  jest.spyOn(authInfoModule, 'useAuthActions').mockReturnValue({
    logout: jest.fn(),
    loginDev: jest.fn(),
    applySession: jest.fn(),
  });
});

describe('LabelProfileEditScreen', () => {
  it('muestra el loading mientras carga el perfil', async () => {
    mockProfile({ status: 'loading', reload: jest.fn() });

    const { getByText } = await render(<LabelProfileEditScreen />);

    expect(getByText('Cargando perfil...')).toBeTruthy();
  });

  it('muestra el error del perfil y permite reintentar', async () => {
    const reload = jest.fn();
    mockProfile({ status: 'error', message: 'No se pudo cargar el perfil', reload });

    const { getByText } = await render(<LabelProfileEditScreen />);

    expect(getByText('No se pudo cargar el perfil')).toBeTruthy();
    await fireEvent.press(getByText('Reintentar'));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('precarga los datos y envía los cambios del formulario', async () => {
    const { getByDisplayValue, getByText } = await render(<LabelProfileEditScreen />);

    expect(getByDisplayValue('Rpruebas Records')).toBeTruthy();
    expect(getByDisplayValue('Sello de prueba')).toBeTruthy();
    expect(getByDisplayValue('https://instagram.com/rpruebas')).toBeTruthy();
    expect(getByDisplayValue('https://soundcloud.com/rpruebas')).toBeTruthy();

    await fireEvent.changeText(getByDisplayValue('Rpruebas Records'), 'Nuevo nombre');
    await fireEvent.press(getByText('Guardar cambios'));

    expect(submit).toHaveBeenCalledWith({
      name: 'Nuevo nombre',
      description: 'Sello de prueba',
      instagramUrl: 'https://instagram.com/rpruebas',
      soundcloudUrl: 'https://soundcloud.com/rpruebas',
      bandcampUrl: undefined,
      twitterUrl: undefined,
    });
    expect(getByText('Cambios guardados')).toBeTruthy();
  });
});

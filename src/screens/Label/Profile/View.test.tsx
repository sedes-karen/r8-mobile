import { fireEvent, render } from '@testing-library/react-native';
import { LabelProfileViewScreen } from './View';
import * as authInfoModule from '../../../features/auth/info';

jest.mock('../../../features/auth/info');

describe('LabelProfileViewScreen', () => {
  it('llama a logout al tocar Cerrar sesión', async () => {
    const logout = jest.fn();
    jest.spyOn(authInfoModule, 'useAuthActions').mockReturnValue({
      logout,
      loginDev: jest.fn(),
      applySession: jest.fn(),
    });

    const { getByText } = await render(<LabelProfileViewScreen />);
    await fireEvent.press(getByText('Cerrar sesión'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});

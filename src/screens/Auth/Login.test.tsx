import { fireEvent, render } from '@testing-library/react-native';
import { AuthLoginScreen } from './Login';
import * as useLoginModule from '../../features/auth/useLogin';

jest.mock('../../features/auth/useLogin');

function mockUseLogin(overrides: Partial<ReturnType<typeof useLoginModule.useLogin>>) {
  jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({
    submit: jest.fn(),
    loading: false,
    error: null,
    ...overrides,
  });
}

describe('AuthLoginScreen', () => {
  it('llama a submit del hook con el email y password ingresados', async () => {
    const submit = jest.fn();
    mockUseLogin({ submit });

    const { getByText, getByPlaceholderText } = await render(<AuthLoginScreen />);
    await fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'a@b.com');
    await fireEvent.changeText(getByPlaceholderText('••••••••'), 'secret123');
    await fireEvent.press(getByText('Ingresar'));

    expect(submit).toHaveBeenCalledWith('a@b.com', 'secret123');
  });

  it('muestra el error que devuelve el hook', async () => {
    mockUseLogin({ error: 'Credenciales inválidas' });

    const { getByText } = await render(<AuthLoginScreen />);
    expect(getByText('Credenciales inválidas')).toBeTruthy();
  });

  it('reemplaza el botón por un spinner mientras loading', async () => {
    mockUseLogin({ loading: true });

    const { queryByText } = await render(<AuthLoginScreen />);
    expect(queryByText('Ingresar')).toBeNull();
  });
});

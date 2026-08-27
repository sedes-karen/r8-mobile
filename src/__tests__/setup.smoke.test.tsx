import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { typography } from '../constants/design';

/**
 * No prueba una pantalla real: solo confirma que el harness de testing (jest-expo + RNTL) está
 * bien configurado antes de que cada pantalla sume su propio smoke test (Commits 3-8).
 */
describe('testing infra', () => {
  it('corre tests de TypeScript puro', () => {
    expect(typography.variants['body-lg'].fontSize).toBe(16);
  });

  it('renderiza un componente de React Native con RNTL', async () => {
    // RNTL v14 (con el nuevo `test-renderer`, reemplazo del react-test-renderer deprecado)
    // resuelve render() de forma asíncrona — hay que awaitearlo, a diferencia de v12/13.
    const { getByText } = await render(<Text>hola r8</Text>);
    expect(getByText('hola r8')).toBeTruthy();
  });
});

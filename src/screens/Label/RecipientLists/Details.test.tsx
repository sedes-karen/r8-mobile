import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { LabelRecipientListsDetailsScreen } from './Details';
import * as useRecipientListDetailModule from '../../../features/recipients/useRecipientListDetail';
import * as useManageMembersModule from '../../../features/recipients/useManageMembers';
import type { RecipientListDetailData } from '../../../features/recipients/useRecipientListDetail';

jest.mock('../../../features/recipients/useRecipientListDetail');
jest.mock('../../../features/recipients/useManageMembers');

const DETAIL_DATA: RecipientListDetailData = {
  list: {
    id: 'list-1',
    labelId: 'label-1',
    name: 'Lista VIP',
    createdAt: '2026-08-27T10:40:43.104Z',
  },
  members: [
    {
      id: 'member-1',
      email: 'valido@ejemplo.com',
      status: 'VALID',
      display_name: 'DJ Valido',
    },
    {
      id: 'member-2',
      email: 'invalido@ejemplo.com',
      status: 'INVALID',
      display_name: null,
    },
  ],
};

const DEFAULT_MANAGE_MEMBERS: ReturnType<typeof useManageMembersModule.useManageMembers> = {
  isAdding: false,
  isRemoving: false,
  removingId: null,
  error: null,
  clearError: jest.fn(),
  pool: null,
  isPoolLoading: false,
  poolError: null,
  loadPool: jest.fn(),
  addByEmail: jest.fn().mockResolvedValue(true),
  addFromPool: jest.fn().mockResolvedValue(true),
  removeMember: jest.fn().mockResolvedValue(true),
};

const MOCK_ROUTE = {
  key: 'Details-key',
  name: 'Details' as const,
  params: { listId: 'list-1' },
};

function mockDetailState(state: ReturnType<typeof useRecipientListDetailModule.useRecipientListDetail>) {
  jest.spyOn(useRecipientListDetailModule, 'useRecipientListDetail').mockReturnValue(state);
}

function mockManageState(state: Partial<ReturnType<typeof useManageMembersModule.useManageMembers>> = {}) {
  jest.spyOn(useManageMembersModule, 'useManageMembers').mockReturnValue({
    ...DEFAULT_MANAGE_MEMBERS,
    ...state,
  });
}

describe('LabelRecipientListsDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockManageState();
  });

  it('muestra el error del hook cuando falla la carga', async () => {
    mockDetailState({
      status: 'error',
      message: 'No se pudo cargar la lista',
      reload: jest.fn(),
    });

    const { getByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    expect(getByText('No se pudo cargar la lista')).toBeTruthy();
  });

  it('muestra EmptyState cuando la lista no tiene destinatarios', async () => {
    mockDetailState({
      status: 'success',
      data: { ...DETAIL_DATA, members: [] },
      reload: jest.fn(),
    });

    const { getByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    expect(getByText('Esta lista todavía no tiene destinatarios.')).toBeTruthy();
  });

  it('muestra los miembros, la insignia de email inválido y el botón Agregar destinatario habilitado', async () => {
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });

    const { getByText, getAllByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    expect(getByText('Lista VIP')).toBeTruthy();
    expect(getByText('DJ Valido')).toBeTruthy();
    expect(getByText('invalido@ejemplo.com')).toBeTruthy();
    expect(getByText('Email inválido')).toBeTruthy();

    const addBtn = getByText('Agregar destinatario');
    expect(addBtn).toBeTruthy();

    const removeButtons = getAllByText('Quitar');
    expect(removeButtons.length).toBe(2);
  });

  it('muestra confirmación con Alert.alert al tocar Quitar', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });

    const { getAllByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    const removeButtons = getAllByText('Quitar');
    fireEvent.press(removeButtons[0]);

    expect(alertSpy).toHaveBeenCalledWith(
      'Quitar destinatario',
      expect.stringContaining('DJ Valido'),
      expect.any(Array),
    );
  });

  it('abre el modal de agregar destinatario al presionar el botón', async () => {
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });

    const { getByText, findByPlaceholderText, findByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    fireEvent.press(getByText('Agregar destinatario'));

    expect(await findByPlaceholderText('persona@ejemplo.com')).toBeTruthy();
    expect(await findByText('Por email')).toBeTruthy();
    expect(await findByText('Desde el pool')).toBeTruthy();
  });

  it('mientras isRemoving es verdadero, deshabilita las acciones de quitar y no abre Alert.alert', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });
    mockManageState({
      isRemoving: true,
      removingId: 'member-1',
    });

    const { getAllByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    // El miembro 1 muestra spinner (loading oculta label Quitar), el miembro 2 muestra Quitar pero la acción está deshabilitada
    const removeButtons = getAllByText('Quitar');
    expect(removeButtons.length).toBe(1);
    fireEvent.press(removeButtons[0]);

    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('deshabilita el botón Agregar destinatario en la pantalla principal mientras isRemoving es verdadero', async () => {
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });
    mockManageState({
      isRemoving: true,
      removingId: 'member-1',
    });

    const { getByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    const addBtn = getByText('Agregar destinatario');
    expect(addBtn.parent?.props.accessibilityState?.disabled).toBe(true);
  });

  it('en el modal, el botón de confirmación indica "Seleccioná un contacto" y no llama a addFromPool si no hay contacto seleccionado', async () => {
    const mockAddFromPool = jest.fn();
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });
    mockManageState({
      pool: [
        { id: 'pool-1', email: 'contacto@pool.com', display_name: 'Contacto Pool' },
      ],
      addFromPool: mockAddFromPool,
    });

    const { getByText, findByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    fireEvent.press(getByText('Agregar destinatario'));
    fireEvent.press(await findByText('Desde el pool'));

    const confirmBtn = await findByText('Seleccioná un contacto');
    expect(confirmBtn).toBeTruthy();

    fireEvent.press(confirmBtn);
    expect(mockAddFromPool).not.toHaveBeenCalled();
  });

  it('en el modal, permite seleccionar un contacto del pool y llamar a addFromPool', async () => {
    const mockAddFromPool = jest.fn().mockResolvedValue(true);
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });
    mockManageState({
      pool: [
        { id: 'pool-1', email: 'contacto@pool.com', display_name: 'Contacto Pool' },
      ],
      addFromPool: mockAddFromPool,
    });

    const { getByText, findByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    fireEvent.press(getByText('Agregar destinatario'));
    fireEvent.press(await findByText('Desde el pool'));

    fireEvent.press(await findByText('Contacto Pool'));

    const confirmBtn = await findByText('Agregar seleccionado');
    expect(confirmBtn).toBeTruthy();

    fireEvent.press(confirmBtn);
    expect(mockAddFromPool).toHaveBeenCalledWith('pool-1');
  });

  it('en el modal, no permite seleccionar contactos del pool que ya pertenecen a la lista', async () => {
    const mockAddFromPool = jest.fn();
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });
    mockManageState({
      pool: [
        { id: 'member-1', email: 'valido@ejemplo.com', display_name: 'DJ Valido' },
      ],
      addFromPool: mockAddFromPool,
    });

    const { getByText, getAllByText, findByText, queryByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    fireEvent.press(getByText('Agregar destinatario'));
    fireEvent.press(await findByText('Desde el pool'));

    expect(await findByText('En lista')).toBeTruthy();

    const poolContacts = getAllByText('DJ Valido');
    // El segundo elemento corresponde al pool en el modal
    fireEvent.press(poolContacts[1]);

    expect(queryByText('Agregar seleccionado')).toBeNull();
    expect(getByText('Seleccioná un contacto')).toBeTruthy();

    fireEvent.press(getByText('Seleccioná un contacto'));
    expect(mockAddFromPool).not.toHaveBeenCalled();
  });

  it('durante isAdding desactiva pestañas, muestra "Agregando..." y bloquea nuevas operaciones', async () => {
    const mockAddByEmail = jest.fn();
    mockDetailState({
      status: 'success',
      data: DETAIL_DATA,
      reload: jest.fn(),
    });
    mockManageState({
      isAdding: true,
      addByEmail: mockAddByEmail,
    });

    const { getByText, findByText } = await render(
      <LabelRecipientListsDetailsScreen route={MOCK_ROUTE as any} />,
    );

    fireEvent.press(getByText('Agregar destinatario'));

    const confirmBtn = await findByText('Agregando...');
    expect(confirmBtn).toBeTruthy();

    fireEvent.press(confirmBtn);
    expect(mockAddByEmail).not.toHaveBeenCalled();

    const emailTab = getByText('Por email');
    const poolTab = getByText('Desde el pool');
    expect(emailTab.parent?.props.accessibilityState?.disabled).toBe(true);
    expect(poolTab.parent?.props.accessibilityState?.disabled).toBe(true);
  });
});

import { render } from '@testing-library/react-native';
import { LabelRecipientListsListScreen } from './List';
import * as useRecipientListsModule from '../../../features/recipients/useRecipientLists';
import type { RecipientListsIndexResponse } from '../../../types/recipients';

jest.mock('../../../features/recipients/useRecipientLists');

const RESPONSE: RecipientListsIndexResponse = {
  lists: [
    { id: 'list-1', labelId: 'label-1', name: 'Rpruebas Recipients', createdAt: '2026-08-27T10:40:43.104Z', recipientCount: 1, hasNonValidMailRecipients: true },
  ],
  total: 1,
  deliverySummary: { totalUniqueEmails: 1, deliveredUniqueEmails: 0, unsubscribedUniqueEmails: 0 },
};

function mockState(state: ReturnType<typeof useRecipientListsModule.useRecipientLists>) {
  jest.spyOn(useRecipientListsModule, 'useRecipientLists').mockReturnValue(state);
}

describe('LabelRecipientListsListScreen', () => {
  it('muestra el error del hook', async () => {
    mockState({ status: 'error', message: 'No se pudieron cargar las listas de destinatarios', reload: jest.fn() });
    const { getByText } = await render(<LabelRecipientListsListScreen />);
    expect(getByText('No se pudieron cargar las listas de destinatarios')).toBeTruthy();
  });

  it('muestra un EmptyState cuando no hay listas', async () => {
    mockState({ status: 'success', data: { ...RESPONSE, lists: [] }, reload: jest.fn() });
    const { getByText } = await render(<LabelRecipientListsListScreen />);
    expect(getByText('Todavía no creaste ninguna lista de destinatarios.')).toBeTruthy();
  });

  it('muestra la lista, el aviso de emails inválidos y los botones deshabilitados', async () => {
    mockState({ status: 'success', data: RESPONSE, reload: jest.fn() });
    const { getByText } = await render(<LabelRecipientListsListScreen />);
    expect(getByText('Rpruebas Recipients')).toBeTruthy();
    expect(getByText('Tiene emails inválidos')).toBeTruthy();
    expect(getByText('Nueva lista')).toBeTruthy();
    expect(getByText('Cargar CSV')).toBeTruthy();
  });
});

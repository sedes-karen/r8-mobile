import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import type { RecipientListSummary } from '../../types/recipients';

type RecipientListRowProps = {
  list: RecipientListSummary;
};

/** Fila de una lista de destinatarios: nombre, cantidad, y aviso si tiene mails inválidos. */
export function RecipientListRow({ list }: RecipientListRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <AppText variant="body-lg" numberOfLines={1}>
          {list.name}
        </AppText>
        {list.hasNonValidMailRecipients ? (
          <AppText variant="body-sm" color={colors.error.default}>
            Tiene emails inválidos
          </AppText>
        ) : null}
      </View>
      <AppText variant="body-sm" color={colors.onSurface.variant}>
        {list.recipientCount} destinatarios
      </AppText>
    </View>
  );
}

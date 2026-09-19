import { View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Badge } from '../atoms/Badge';
import type { RecipientListMember } from '../../types/recipients';

type RecipientMemberRowProps = {
  member: RecipientListMember;
};

// La API solo devolvió 'VALID' en stage y no hay enum documentado, así que cualquier otro valor
// se considera no entregable en vez de intentar enumerar estados que no conocemos.
const VALID_MAIL_STATUS = 'VALID';

/**
 * Fila de un destinatario dentro de una lista.
 * No confundir con RecipientListRow, que representa una lista entera en el índice.
 */
export function RecipientMemberRow({ member }: RecipientMemberRowProps) {
  const hasValidMail = member.status === VALID_MAIL_STATUS;
  // Un display_name vacío (CSV sin columna de nombre) se trata igual que ausente: el email pasa a
  // ser el título en vez de dejar la fila sin texto visible.
  const displayName = member.display_name || null;

  return (
    <View
      style={{
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
      }}
    >
      <AppText variant="body-lg" numberOfLines={1}>
        {displayName ?? member.email}
      </AppText>

      {displayName ? (
        <AppText variant="body-sm" color={colors.onSurface.variant} numberOfLines={1}>
          {member.email}
        </AppText>
      ) : null}

      {hasValidMail ? null : <Badge label="Email inválido" />}
    </View>
  );
}

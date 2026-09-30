import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';

type SuccessNoticeProps = {
  title: string;
  message?: string;
  /** Contenido opcional debajo del mensaje (por ejemplo, un link de vuelta a otra pantalla). */
  children?: ReactNode;
};

/**
 * Bloque de confirmación para acciones que ya se guardaron en el servidor (por ahora, el envío
 * del feedback). Va inline en la pantalla en vez de un Alert: el usuario sigue viendo lo que
 * envió y puede navegar sin confirmar un modal.
 */
export function SuccessNotice({ title, message, children }: SuccessNoticeProps) {
  return (
    <View style={styles.container}>
      <AppText variant="title-md">{title}</AppText>
      {message ? (
        <AppText variant="body-sm" color={colors.onSurface.variant}>
          {message}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.container,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
});

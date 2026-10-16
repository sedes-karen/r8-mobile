import { Pressable, View } from 'react-native';
import { type ReactNode } from 'react';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';


type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
};

export function Modal({ title, children, onClose, onCancel, onConfirm, confirmLabel = 'Confirmar' }: ModalProps) {
  return (
    <View
      style={{
        backgroundColor: colors.surface.container,
        padding: spacing.lg,
        gap: spacing.md,
      }}
    >
      <Pressable onPress={onClose}>
        <AppText variant="title-md">x</AppText>
      </Pressable>

      <AppText variant="title-md">
        {title}
      </AppText>

      {children}

      <Button
        label="Cancelar"
        variant="secondary"
        onPress={onCancel}
      />

      <Button
        label={confirmLabel}
        onPress={onConfirm}
      />
    </View>
  );
}
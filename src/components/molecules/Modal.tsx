import { Modal as NativeModal, Pressable, View } from 'react-native';
import { type ReactNode } from 'react';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { LucideIcon } from '../atoms/LucideIcon';

type ModalProps = {
  title: string;
  children: ReactNode;
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
};

export function Modal({ title, children, visible, onClose, onCancel, onConfirm, confirmLabel = 'Confirmar' }: ModalProps) {
  return (
    <NativeModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
        {/* Fondo oscuro que ocupa toda la pantalla */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: spacing.lg,
        }}
      >
        {/* Tarjeta del modal */}
        <View
          style={{
            backgroundColor: colors.surface.container,
            padding: spacing.lg,
            gap: spacing.lg,
          }}
        >

          <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
            <AppText variant="headline-lg">{title}</AppText>
            <Pressable onPress={onClose} style={{marginLeft: 'auto'}}>
              <LucideIcon name="x" variant="title-md" color={colors.surface.bright}  />
            </Pressable>
          </View>


          {children}

          <View style={{display: 'flex', flexDirection: 'row', gap: 5, width: '100%'}}>
            <View style={{flex: 3}} />
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
        </View>
      </View>
    </NativeModal>
  );
}
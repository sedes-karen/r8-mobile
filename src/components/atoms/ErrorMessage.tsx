import { colors } from '../../constants/design';
import { AppText } from './AppText';

type ErrorMessageProps = {
  message: string;
};

/** Texto de error puntual — un campo de formulario o un error de request. */
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <AppText variant="body-sm" color={colors.error.default} accessibilityRole="alert">
      {message}
    </AppText>
  );
}

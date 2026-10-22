import { Image, View } from 'react-native';
import { colors } from '../../constants/design';
import { AppText } from './AppText';

type AvatarProps = {
  imageUrl?: string | null;
  /** Nombre completo (o lo que sea) para las iniciales de fallback cuando no hay imagen. */
  fallbackName: string;
  size?: number;
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** Imagen circular con fallback de iniciales — para artista o label, el shape es el mismo. */
export function Avatar({ imageUrl, fallbackName, size = 64 }: AvatarProps) {
  const style = { width: size, height: size, borderRadius: size / 2 };

  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={style} accessibilityLabel={fallbackName} />;
  }

  return (
    <View
      style={[
        style,
        { backgroundColor: colors.surface.containerHigh, alignItems: 'center', justifyContent: 'center' },
      ]}
      accessibilityLabel={fallbackName}
    >
      <AppText variant="title-md">{initialsFrom(fallbackName)}</AppText>
    </View>
  );
}

import {
  useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';

/**
 * Carga IBM Plex Mono (mismo criterio tipográfico que r8-site) antes del primer render con
 * contenido real. Mientras no cargó (o si falla), los AppText caen al fallback `monospace` del
 * sistema — ver src/constants/design.ts `typography.fontFamily.fallback`.
 */
export function useAppFonts() {
  const [fontsLoaded, fontError] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  // Si falla la descarga (ej. sin red la primera vez), no bloqueamos el arranque de la app:
  // seguimos con el fallback y logueamos para diagnóstico.
  if (fontError) {
    console.warn('No se pudieron cargar las fuentes IBM Plex Mono, se usa el fallback', fontError);
  }

  return fontsLoaded || Boolean(fontError);
}

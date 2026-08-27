import {
  useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';

/**
 * Carga IBM Plex Mono (mismo criterio tipográfico que r8-site) antes del primer render con
 * contenido real. Si falla la carga, no bloqueamos el arranque — ver el manejo de fontError
 * abajo — y los AppText simplemente renderizan con la fuente por defecto de la plataforma,
 * porque RN no rompe cuando el fontFamily pedido no está registrado.
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

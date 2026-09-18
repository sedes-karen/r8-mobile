import { LinkProps, useLinkProps } from "@react-navigation/native";
import { PropsWithChildren } from "react";
import { Pressable, PressableProps } from "react-native";

// Link invisible por defecto; se le puede cambiar el estilo
export function LinkButton<ParamList extends ReactNavigation.RootParamList>({ screen, params, action, href, children, style }: PropsWithChildren<{ style?: PressableProps['style'] } & LinkProps<ParamList>>) {
  const props = useLinkProps<ParamList>(
    // Sin este cast no anda porque (por razones desconocidas) TypeScript decide recortar el tipo al llamar la función (cosa que no debería hacer)
    // El editor muestra que ambos LinkButton y useLinkProps usan LinkProps<ParamList>, por lo que el cast es seguro
    // NOTE: Si un link crashea al hacerle click, quizás esto tenga que ver (si no resulta ser tan seguro como parece)
    { screen, params, action, href } as any
  );
  return (
    <Pressable accessibilityRole="button" {...props} style={style ?? { backgroundColor: 'transparent' }}>
      {children}
    </Pressable>
  );
}

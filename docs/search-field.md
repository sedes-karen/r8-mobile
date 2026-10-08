# Campo de búsqueda compartido

`SearchField` es una molécula que combina `Input` y `Button`. Sirve para
promos, releases, destinatarios o cualquier listado. No conoce servicios,
roles ni navegación. La pantalla mantiene el texto y filtra sus datos.

## Ejemplo de uso

Este ejemplo puede copiarse a una pantalla ajustando las rutas de importación:

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { AppText } from '../components/atoms/AppText';
import { SearchField } from '../components/molecules/SearchField';
import { spacing } from '../constants/design';

const titles = ['Promo de septiembre', 'Nuevo release', 'Promo de octubre'];

export function SearchExample() {
  const [query, setQuery] = useState('');
  const search = query.trim().toLocaleLowerCase();
  const results = titles.filter((title) =>
    title.toLocaleLowerCase().includes(search),
  );

  return (
    <View style={{ padding: spacing.md, gap: spacing.md }}>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por título..."
        accessibilityLabel="Buscar por título"
      />
      {results.map((title) => <AppText key={title}>{title}</AppText>)}
      {results.length === 0 ? <AppText>Sin resultados.</AppText> : null}
    </View>
  );
}
```

## Comportamiento

- `value` y `onChangeText` son obligatorios: el componente es controlado.
- Al escribir, notifica el texto; al limpiar, notifica una cadena vacía.
- El botón aparece solamente si hay texto, incluidos espacios.
- `editable={false}` o `readOnly` también deshabilitan el botón.
- Admite props de `TextInput`, como `onSubmitEditing`, `maxLength` y `testID`.
- `style` personaliza el input. `clearLabel` personaliza el texto del botón.
- El botón queda debajo del campo para dar espacio a textos largos y fuentes grandes.

Para un buscador dentro de un `ScrollView` o `FlatList`, considerar
`keyboardShouldPersistTaps="handled"` en el contenedor para que el primer
toque en limpiar llegue al botón mientras está abierto el teclado.
import { View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/design';
import { AppText } from '../../components/atoms/AppText';
import { PasswordResetForm } from '../../components/organisms/PasswordResetForm';



export function AuthPasswordResetScreen() {
  const [email, setEmail] = useState('');
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.xl }}>
            <AppText variant="headline-lg">Restablecer contraseña</AppText>
            <PasswordResetForm 
            email={email} 
            onChangeEmail={setEmail}
            onSubmit={() => {}}
            loading={false}
            error={null}
            />
          </View>
    </SafeAreaView>
  );
}

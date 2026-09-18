import { View } from 'react-native'; 
import { spacing } from '../../constants/design'; 
import { Button } from '../atoms/Button'; 
import { ErrorMessage } from '../atoms/ErrorMessage'; 
import { LabeledInput } from '../molecules/LabeledInput'; 

type RegisterFormProps = { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string; 

    onChangeName: (value: string) => void; 
    onChangeEmail: (value: string) => void; 
    onChangePassword: (value: string) => void; 
    onChangeConfirmPassword: (value: string) => void; 
    onSubmit: () => void; loading: boolean; error: string | null; }; 
    
    export function RegisterForm({ 
        name, 
        email, 
        password, 
        confirmPassword, 
        onChangeName, 
        onChangeEmail, 
        onChangePassword, 
        onChangeConfirmPassword, 
        onSubmit, 
        loading, 
        error, }: RegisterFormProps) { 
            
            return ( 
                <View style={{ gap: spacing.md }}> 
                    
                    <LabeledInput 
                        label="Nombre" 
                        value={name} 
                        onChangeText={onChangeName} 
                    /> 
                    <LabeledInput 
                        label="Email" 
                        value={email} 
                        onChangeText={onChangeEmail} 
                        autoCapitalize="none" 
                        autoComplete="email" 
                        keyboardType="email-address" 
                        placeholder="tu@email.com" 
                        editable={!loading} 
                    /> 
                    <LabeledInput 
                        label="Contraseña" 
                        value={password} 
                        onChangeText={onChangePassword} 
                        autoCapitalize="none" 
                        autoComplete="password" 
                        secureTextEntry 
                        placeholder="••••••••" 
                        editable={!loading} 
                    /> 
                    <LabeledInput 
                        label="Confirmar contraseña" 
                        value={confirmPassword} 
                        onChangeText={onChangeConfirmPassword} 
                        autoCapitalize="none" 
                        autoComplete="password" 
                        secureTextEntry 
                        placeholder="••••••••" 
                        editable={!loading} 
                    /> 

                    {error ? <ErrorMessage message={error} /> : null} 

                    <Button 
                        label="Registrarse" 
                        onPress={onSubmit} 
                        loading={loading} 
                        disabled={!name || !email || !password || !confirmPassword} 
                    /> 
                    
                </View> );
                }
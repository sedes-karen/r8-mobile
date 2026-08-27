import React, {useState} from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";

export function LoginForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        console.log("registrando usuario");
        console.log("Nombre:", name);
        console.log("Email:", email);
        console.log("Contraseña:", password);
    }
    return (
       <View style={styles.container}>
        
            <Text variant="h1">
                Login
            </Text>

            <Text variant="label">
                Nombre
            </Text>

            <Input 
                type="text"
                placeholder="Ingrese su nombre" 
                value={name}
                onChangeText={setName}
            />

            <Text variant="label">
                Email
            </Text>

            <Input 
                type="email"
                placeholder="Ingrese su email"
                value={email}
                onChangeText={setEmail}
            />

            <Text variant="label">
                Contraseña
            </Text>

            <Input 
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChangeText={setPassword}
            />

            <Button
                variant="primary"
                size="lg"
                onPress={handleRegister}
            >
                Registrarse
            </Button>

       </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});
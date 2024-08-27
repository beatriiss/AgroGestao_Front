import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import palette from "../styles/palette";
import GlobalStyles from "../styles/global";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth(); // Assumindo que existe uma função de registro no contexto de autenticação

  const handleRegister = () => {
    // Simulação de registro
    if (name && email && password) {
      register({ name, email, password });
      alert("Usuário registrado com sucesso");
    } else {
      alert("Por favor, preencha todos os campos");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Background_login.png")} // Certifique-se de ter essa imagem em sua pasta de assets
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={50} // Ajuste conforme necessário
      >
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
            style={GlobalStyles.input}
          />

          <TextInput
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            style={GlobalStyles.input}
          />

          <TextInput
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={GlobalStyles.input}
          />

          <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleRegister}>
            <Text style={GlobalStyles.textButton}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.link}>Já possui uma conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fundo semi-transparente
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 220,
    gap: 20,
  },
  link: {
    color: palette.highlightGreen,
    fontWeight: "600",
    textAlign: "center", // Alinhamento centralizado para melhorar a leitura
    fontSize: 16,
    marginTop: 20,
  },
});

export default RegisterScreen;

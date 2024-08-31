// src/components/LoginScreen.js
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
import { showFlashMessage } from "../components/Message";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();


  const handleLogin = async () => {
    if (email && password) {
      try {
        await login({email, senha: password});
      } catch (error) {
        alert("Erro de Login", "Credenciais inválidas");
      }
    } else {
      showFlashMessage('Preeencha todos os campos', 'danger');
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
        keyboardVerticalOffset={50} 
      >
        <View style={styles.formContainer}>
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

          <TouchableOpacity
            style={styles.recuperarSenha}
            onPress={() =>
              alert(
                "Funcionalidade de recuperação de senha ainda não implementada"
              )
            }
          >
            <Text style={styles.link}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleLogin}>
            <Text style={GlobalStyles.textButton}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.link}>Ainda não tem um cadastro?</Text>

          <TouchableOpacity
            style={styles.cadastroButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={GlobalStyles.textButton}>Cadastre-se</Text>
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
    textAlign: "right",
    fontSize: 16,
  },
  cadastroButton: {
    backgroundColor: palette.secondaryGreen,
    width: "100%",
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  recuperarSenha: {
    width: "100%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: -10,
    marginBottom: -10,
  },
});

export default LoginScreen;

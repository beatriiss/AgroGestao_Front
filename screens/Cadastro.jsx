// src/screens/RegisterScreen.js
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
  Alert, // Usando Alert para mostrar mensagens ao usuário
} from "react-native";
import { useAuth } from "../context/AuthContext";
import palette from "../styles/palette";
import GlobalStyles from "../styles/global";
import { showFlashMessage } from "../components/Message";
import validate from "../utils/functions/validate"

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();

  const handleRegister = async () => {
    if (name && email && password) {
      const validateEmail = await validate('email', email);
      if (validateEmail) {
        try {
          await register({ nome: name, email, senha: password });
          Alert.alert("Sucesso", "Usuário registrado com sucesso");
        } catch (error) {
          Alert.alert("Erro", "Erro ao registrar usuário. Por favor, tente novamente.");
          console.log(error)
        }
      }else{
        showFlashMessage('Email invalido', 'warning')
      }
    } else {
      showFlashMessage('Preencha todos os campos', 'warning');
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Background_login.png")}
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
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 220,
    gap: 20,
  },
  link: {
    color: palette.highlightGreen,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default RegisterScreen;

import React, { createContext, useContext, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from "react-native"; // Adicione Image

// Criação do contexto
const AlertContext = createContext();

// Hook para usar o contexto
export const useAlert = () => useContext(AlertContext);

// Provedor de contexto
export const AlertProvider = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setAlertMessage("");
    setAlertTitle("");
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        visible={alertVisible}
        onClose={hideAlert}
        title={alertTitle}
        message={alertMessage}
      />
    </AlertContext.Provider>
  );
};

// Componente de alerta personalizado
const CustomAlert = ({ visible, onClose, title, message }) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Definir o estilo da StatusBar aqui */}
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {/* Adiciona a logo do aplicativo */}
          {/* <Image
            source={require("../assets/logo.png")} // Substitua pelo caminho correto da sua logo
            style={styles.logo}
            resizeMode="contain"
          /> */}

          {/* Título do alerta */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Mensagem do alerta */}
          <Text style={styles.message}>{message}</Text>

          {/* Botão de fechar */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: "90%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "flex-start", // Alinhar conteúdo à esquerda
  },
  logo: {
    width: 100, // Defina a largura da logo conforme necessário
    height: 100, // Defina a altura da logo conforme necessário
    alignSelf: "center", // Alinhar logo ao centro horizontalmente
    marginBottom: 20, // Adicionar espaço abaixo da logo
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    alignSelf: "flex-start", // Alinhar o título à esquerda
  },
  message: {
    fontSize: 16,
    textAlign: "left", // Alinhar a mensagem à esquerda
    marginBottom: 20,
    color: "#000000",
    alignSelf: "flex-start", // Alinhar a mensagem à esquerda
  },
  button: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "flex-end", // Alinhar botão à direita
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default CustomAlert;

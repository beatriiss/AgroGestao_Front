import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import palette from "../styles/palette";

const CustomAlert = ({ visible, onClose, title, message }) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: "80%",
    padding: 20,
    backgroundColor: palette.primaryGreen, // Usando a cor primária do tema
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: palette.secondaryGreen, // Usando cor secundária
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: palette.fontColorPrimary, // Usando cor de fonte principal
  },
  button: {
    backgroundColor: palette.secondaryGreen,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: palette.primaryFontColor,
    fontWeight: "bold",
  },
});

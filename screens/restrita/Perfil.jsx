import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  ScrollView,
  Keyboard,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import { ModalPassword } from "../../components/Modal/ModalPassword";
import Header from "../../components/Header";

const Perfil = () => {
  const { currentUser, editUser } = useAuth();
  const [nome, setNome] = useState(currentUser?.nome || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState(currentUser?.senha || "");
  const [edit, setEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSave = async () => {
    if (currentUser) {
      try {
        const userId = currentUser.id; // Identificador do usuário
        const userData = { nome, email, senha: password };
        await editUser(userId, userData);
        setEdit(false);
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // Ajuste para compensar a altura do teclado
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Header screenName={edit ? "Edição de Perfil" : "Perfil"} />
        <View style={styles.container}>
          {!keyboardVisible && (
            <Image
              style={styles.logo}
              source={require("../../assets/logo.png")}
            />
          )}
          <View style={styles.form}>
            <Text style={styles.legend}>Nome:</Text>
            <TextInput
              selectionColor={palette.highlightGreen}
              onChangeText={(e) => setNome(e)}
              style={[GlobalStyles.input, !edit && { color: "#000" }]}
              placeholder="Nome"
              editable={edit}
              value={nome}
            ></TextInput>

            <Text style={styles.legend}>Email:</Text>
            <TextInput
              selectionColor={palette.highlightGreen}
              onChangeText={(e) => setEmail(e)}
              style={[GlobalStyles.input, !edit && { color: "#000" }]}
              placeholder="email"
              editable={edit}
              value={email}
            ></TextInput>

            <Text style={styles.legend}>Senha:</Text>
            <TextInput
              selectionColor={palette.highlightGreen}
              onChangeText={(e) => setPassword(e)}
              style={[GlobalStyles.input, !edit && { color: "#000" }]}
              placeholder="senha"
              secureTextEntry={!edit}
              editable={edit}
              value={password}
            ></TextInput>

            {edit ? (
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[
                    GlobalStyles.primaryButton,
                    styles.button,
                    { width: "48%", backgroundColor: palette.danger },
                  ]}
                  onPress={() => setEdit(false)}
                >
                  <Text style={GlobalStyles.textButton}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    GlobalStyles.primaryButton,
                    styles.button,
                    { width: "48%" },
                  ]}
                  onPress={handleSave}
                >
                  <Text style={GlobalStyles.textButton}>Salvar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[GlobalStyles.primaryButton, styles.button]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={GlobalStyles.textButton}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>
          {!edit && (
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <Text
                style={{
                  marginTop: 20,
                  color: palette.danger,
                  fontWeight: "600",
                }}
              >
                Solicitar exclusão de conta
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalPassword
          editable={() => setEdit(true)}
          handleClose={() => setModalVisible(false)}
        />
      </Modal>
      <Modal
        visible={deleteModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Solicitação de Exclusão</Text>
            <Text style={styles.modalText}>
              Para excluir sua conta, envie um e-mail para:{"\n"}
              <Text style={{ fontWeight: "bold" }}>
                isisbeatris.dev@gmail.com
              </Text>{" "}
              solicitando a remoção dos seus dados da base de dados.
            </Text>
            <TouchableOpacity
              style={[GlobalStyles.primaryButton, styles.modalButton]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={GlobalStyles.textButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttons: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  legend: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginVertical: 10,
  },
  button: {
    marginTop: 16,
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: -140,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
  },
});

export default Perfil;

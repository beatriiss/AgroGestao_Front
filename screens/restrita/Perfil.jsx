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
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalPassword
          editable={() => setEdit(true)}
          handleClose={() => setModalVisible(false)}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Início do estilo do header
  header: {
    flexDirection: "row",
    backgroundColor: palette.primaryGreen,
    padding: 16,
    justifyContent: "space-between",
  },
  textheader: {
    color: "#fff",
    fontSize: 16,
  },
  // Fim do estilo do header
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttons:{
    display:'flex',
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between'
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
});

export default Perfil;

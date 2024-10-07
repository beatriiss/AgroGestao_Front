import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importe o Picker
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { url } from "../../config/url"; // Certifique-se de ter a URL do backend configurada aqui
import GlobalStyles from "../../styles/global";
import Header from "../../components/Header";
import moment from "moment-timezone";
import palette from "../../styles/palette";
import { showFlashMessage } from "../../components/Message";
import AntDesign from "@expo/vector-icons/AntDesign";

const especiesComuns = [
  { label: "Milho", value: "Milho" },
  { label: "Amendoim", value: "Amendoim" },
  { label: "Mandioca", value: "Mandioca" },
  { label: "Aipim", value: "Aipim" },
  { label: "Laranja", value: "Laranja" },
];

const AdicionarCultura = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentUser } = useAuth(); // Para obter informações do usuário logado, se necessário
  const [cultura, setCultura] = useState("");
  const [dataPlantio, setDataPlantio] = useState("");
  const [areaPlantada, setAreaPlantada] = useState("");
  const [nome, setNome] = useState("");
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

  const propriedadeID = route.params.propriedadeID; // ID da propriedade passada via route

  const handleSubmit = async () => {
    if (!cultura || !areaPlantada || !dataPlantio|| !nome) {
      showFlashMessage("Todos os campos são obrigatórios.", "danger");
      return;
    }

    try {
        console.log(cultura, areaPlantada, dataPlantio, nome)

    } catch (error) {
      console.error("Erro ao adicionar criação:", error);
      showFlashMessage(
        "Ocorreu um erro. Por favor, tente novamente.",
        "danger"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Header screenName="Adicionar Cultura" />

      <View style={styles.container}>
        {!keyboardVisible && (
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />
        )}
        <View style={[styles.form, keyboardVisible && { marginTop: -50 }]}>
          <Text style={styles.label}>Cultura</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cultura}
              onValueChange={(itemValue) => setCultura(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma cultura" value="" />
              {especiesComuns.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Nome da criação</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite o nome da cultura"
            keyboardType="text"
            value={nome}
            onChangeText={(text) => setNome(text)}
          />

          <Text style={styles.label}>Data Plantio</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite o número de animais"
            keyboardType="numeric"
            value={dataPlantio}
            onChangeText={(text) => setDataPlantio(text)}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={styles.label}>Área plantada (em tarefas)</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="questioncircle" size={24} color="gray" />
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true} // Isso garante que o fundo do modal seja visível
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                    A tarefa é uma medida utilizada principalmente na região Nordeste do Brasil. Seu valor pode variar entre 2.500 e 3.000 metros quadrados. Essa medida tem influências históricas e culturais da colonização portuguesa, sendo utilizada para medir áreas rurais e propriedades agrícolas na região
                    </Text>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Fechar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite o peso médio"
            keyboardType="numeric"
            value={areaPlantada}
            onChangeText={(text) => setAreaPlantada(text)}
          />
          <TouchableOpacity
            style={[GlobalStyles.primaryButton, { marginTop: 20 }]}
            onPress={handleSubmit}
          >
            <Text style={GlobalStyles.textButton}>Adicionar Criação</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: -50,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  pickerContainer: {
    width: "100%",
    height: 45,
    borderColor: palette.primaryGreen,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#000",
    justifyContent: "center",
    display: "flex",
    alignItems: "flex-start",
  },
  picker: {
    width: "100%",
    marginLeft: -20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  modalView: {
    marginVertical: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: palette.secondaryGreen,
    borderRadius: 5,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "justify",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escuro com opacidade
    justifyContent: "center", // Centralizar o modal
    alignItems: "center", // Centralizar o modal
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdicionarCultura;

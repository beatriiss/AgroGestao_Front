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
  { label: "Gado", value: "Gado" },
  { label: "Suínos", value: "Suínos" },
  { label: "Ovelhas", value: "Ovelhas" },
  { label: "Cabras", value: "Cabras" },
  { label: "Frangos", value: "Frangos" },
  { label: "Patos", value: "Patos" },
  { label: "Cavalos", value: "Cavalos" },
];

const AdicionarCriacao = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentUser } = useAuth(); // Para obter informações do usuário logado, se necessário
  const [especie, setEspecie] = useState("");
  const [numeroAnimais, setNumeroAnimais] = useState("");
  const [pesoMedio, setPesoMedio] = useState("");
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
    if (!especie || !numeroAnimais || !pesoMedio) {
      showFlashMessage("Todos os campos são obrigatórios.", "danger")
      return;
    }

    try {
      await axios.post(`${url}/creations`, {
        especie,
        numero_animais: parseInt(numeroAnimais),
        propriedade_id: propriedadeID,
        peso_medio: parseFloat(pesoMedio),
        data_criacao: moment().tz("America/Bahia").format(),
        nome
      });

      showFlashMessage("Criação adicionada com sucesso!", "success");
      navigation.goBack(); // Voltar para a tela anterior após adicionar
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
      <Header screenName="Adicionar Criação" />

      <View style={styles.container}>
        {!keyboardVisible && (
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />
        )}
        <View style={[styles.form, keyboardVisible &&{marginTop:-40}]}>
          <Text style={styles.label}>Espécie</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especie}
              onValueChange={(itemValue) => setEspecie(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma espécie" value="" />
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
            placeholder="Digite o nome da criação"
            keyboardType="text"
            value={nome}
            onChangeText={(text) => setNome(text)}
          />

          <Text style={styles.label}>Número de Animais</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite o número de animais"
            keyboardType="numeric"
            value={numeroAnimais}
            onChangeText={(text) => setNumeroAnimais(text)}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={styles.label}>Peso Médio (em arrobas)</Text>
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
          A arroba é uma unidade de peso utilizada no Brasil para
          medir a massa dos bovinos. Ela equivale a 14,688 quilogramas
          (kg), que são arredondados para 15 kg, facilitando assim as
          contas.
        </Text>
        <Text style={styles.modalText}>
          Dessa forma: 1 arroba = 15kg
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
            value={pesoMedio}
            onChangeText={(text) => setPesoMedio(text)}
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
    marginTop:20,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro com opacidade
    justifyContent: 'center', // Centralizar o modal
    alignItems: 'center', // Centralizar o modal
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdicionarCriacao;

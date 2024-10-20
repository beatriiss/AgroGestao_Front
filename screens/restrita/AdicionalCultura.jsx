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
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { url } from "../../config/url";
import GlobalStyles from "../../styles/global";
import Header from "../../components/Header";
import moment from "moment-timezone";
import palette from "../../styles/palette";
import { showFlashMessage } from "../../components/Message";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getCultivationDetails } from "../../utils/requests/getCultivationDetails";
import { updateCultivation } from "../../utils/requests/updateCultivation";

const especiesComuns = [
  { label: "Milho", value: "Milho" },
  { label: "Amendoim", value: "Amendoim" },
  { label: "Mandioca", value: "Mandioca" },
  { label: "Aipim", value: "Aipim" },
  { label: "Laranja", value: "Laranja" },
];

const AdicionarCultura = ({ navigation, route }) => { 
  const { propriedadeID = null, cultivoID = null } = route?.params || {};

  const [modalVisible, setModalVisible] = useState(false);
  const { currentUser } = useAuth();
  const [cultura, setCultura] = useState("");
  const [dataPlantio, setDataPlantio] = useState("");
  const [areaPlantada, setAreaPlantada] = useState("");
  const [nome, setNome] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isDateValid, setIsDateValid] = useState(false);

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
  useEffect(() => {
    const fetchCultivation = async () => {
      if (cultivoID != null) {
        try {
          const cultivationDetails = await getCultivationDetails(criacaoID);
          setCultura(cultivationDetails.tipo);
          setDataPlantio(cultivationDetails.data_plantio.toString());
          setAreaPlantada(cultivationDetails.area_plantada.toString());
          setNome(cultivationDetails.nome);
        } catch (error) {
          console.error("Error fetching property details:", error);
        }
      }
    };

    fetchCultivation();
  }, []);

  const formatDateString = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }

    setDataPlantio(formatted);
  };

  const validateAndSetDate = (text) => {
    formatDateString(text);
    const date = moment(text, "DD/MM/YYYY", true);
    if (date.isValid()) {
      setIsDateValid(true);
    } else {
      setIsDateValid(false);
    }
  };

  const handleSubmit = async () => {
    if (!cultura || !areaPlantada || !dataPlantio || !nome) {
      showFlashMessage("Todos os campos são obrigatórios.", "danger");
      return;
    }

    if (!isDateValid) {
      showFlashMessage("Data inválida. Use o formato DD/MM/YYYY.", "danger");
      return;
    }

    const formattedDate = moment(dataPlantio, "DD/MM/YYYY").format("YYYY-MM-DD");

    try {
      const response = await axios.post(`${url}/cultivations/`, {
        tipo: cultura,
        area_plantada: areaPlantada,
        propriedade_id: propriedadeID,
        data_plantio: formattedDate,
        data_criacao: moment().format("YYYY-MM-DD HH:mm:ss"),
        nome,
      });
      if (response.status === 201) {
        showFlashMessage("Cultura adicionada com sucesso!", "success");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao adicionar cultura:", error);
      showFlashMessage("Ocorreu um erro. Por favor, tente novamente.", "danger");
    }
  };
  const handleEdit = async () => {
    if (!cultura || !areaPlantada || !dataPlantio || !nome) {
      showFlashMessage("Todos os campos são obrigatórios.", "danger");
      return;
    }

    if (!isDateValid) {
      showFlashMessage("Data inválida. Use o formato DD/MM/YYYY.", "danger");
      return;
    }

    const formattedDate = moment(dataPlantio, "DD/MM/YYYY").format("YYYY-MM-DD");

    try {
      const cultivationData = {
        tipo: cultura,
        area_plantada: areaPlantada,
        data_plantio: formattedDate,
        nome,        
      }
      const response = await updateCultivation(cultivoID, cultivationData);
      navigation.goBack(); // Voltar para a tela anterior após editar
    } catch (error) {
      console.error("Erro ao adicionar cultura:", error);
      showFlashMessage("Ocorreu um erro. Por favor, tente novamente.", "danger");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Header screenName={cultivoID === null ? "Adicionar Cultura" : "Editar Cultura"} />
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
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Nome da cultura</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite o nome da cultura"
            keyboardType="default"
            value={nome}
            onChangeText={setNome}
          />
          <Text style={styles.label}>Data Plantio</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="DD/MM/YYYY"
            keyboardType="numeric" // Muda para numérico
            value={dataPlantio}
            onChangeText={validateAndSetDate}
            editable={!isDateValid} // Desabilita o campo se a data for válida
          />
          <View style={styles.areaContainer}>
            <Text style={styles.label}>Área plantada (em tarefas)</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="questioncircle" size={24} color="gray" />
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(!modalVisible)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      A tarefa é uma medida utilizada principalmente na região Nordeste do Brasil. Seu valor pode variar entre 2.500 e 3.000 metros quadrados.
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
            placeholder="Digite a área plantada"
            keyboardType="numeric"
            value={areaPlantada}
            onChangeText={setAreaPlantada}
          />
          <TouchableOpacity
            style={[GlobalStyles.primaryButton, { marginTop: 20 }]}
            onPress={cultivoID === null ? handleSubmit : handleEdit}
          >
            <Text style={GlobalStyles.textButton}>{cultivoID === null ? "Adicionar Cultivo" : "Editar Cultivo"}</Text>
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
    alignItems: "flex-start",
  },
  picker: {
    width: "100%",
    marginLeft: -10,
  },
  areaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
  form: {
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdicionarCultura;

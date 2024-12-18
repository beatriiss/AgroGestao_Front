import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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

const AdicionarVacina = ({ navigation, route }) => {
  const [vacinaComum, setVacinaComum] = useState("");
  const [vacinasComuns, setVacinasComuns] = useState([]);
  const [nome, setNome] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isDateValid, setIsDateValid] = useState(false);
  const criacaoID = route.params.creationID;

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
    const fetchVacinasComuns = async () => {
      try {
        const response = await axios.post(`${url}/vaccines/standart`);
        if (response.status === 200) {
          setVacinasComuns(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar vacinas comuns:", error);
        showFlashMessage("Erro ao carregar vacinas comuns.", "danger");
      }
    };

    fetchVacinasComuns();
  }, []);

  const handleSubmit = async () => {
    if (!vacinaComum || !nome || !dataCriacao) {
      showFlashMessage("Todos os campos são obrigatórios.", "danger");
      return;
    }

    try {
      const response = await axios.post(`${url}/vaccines`, {
        nome,
        criacao_id: criacaoID,
        vacina_comum_id: vacinaComum,
        data_criacao: moment().format("YYYY-MM-DD HH:mm:ss"),
        data_vacinacao: moment(dataCriacao, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss")

      });

      if (response.status === 201) {
        showFlashMessage("Vacina adicionada com sucesso!", "success");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao adicionar vacina:", error);
      showFlashMessage("Ocorreu um erro. Por favor, tente novamente.", "danger");
    }
  };

  const formatDateString = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }

    setDataCriacao(formatted);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Header screenName="Adicionar Vacina" />
      <View style={styles.container}>
        {!keyboardVisible && (
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />
        )}
        <View style={[styles.form, keyboardVisible && { marginTop: -50 }]}>
          <Text style={styles.label}>Vacina</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vacinaComum}
              onValueChange={(itemValue) => setVacinaComum(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma vacina" value="" />
              {vacinasComuns.map((item) => (
                <Picker.Item key={item.id} label={item.nome} value={item.id} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Nome da Vacina</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite o nome da vacina"
            keyboardType="default"
            value={nome}
            onChangeText={setNome}
          />
          <Text style={styles.label}>Data de Vacinação</Text>

        <TextInput
            style={GlobalStyles.input}
            placeholder="DD/MM/YYYY"
            keyboardType="default"
            value={dataCriacao}
            onChangeText={validateAndSetDate}
          />
          <TouchableOpacity
            style={[GlobalStyles.primaryButton, { marginTop: 20 }]}
            onPress={handleSubmit}
          >
            <Text style={GlobalStyles.textButton}>Adicionar Vacina</Text>
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
    justifyContent: "center",
    alignItems: "flex-start",
  },
  picker: {
    width: "100%",
    marginLeft: -10,
  },
  form: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
});

export default AdicionarVacina;

// src/components/PropertiesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { useAuth } from "../../context/AuthContext"; // Certifique-se de ter este hook para obter o usuário autenticado
import Header from "../../components/Header";
import GlobalStyles from "../../styles/global";
import { createProperty } from "../../utils/requests/createProperty";
import { showFlashMessage } from "../../components/Message";
import { getPropertyDetails } from "../../utils/requests/getPropertyDetails";
import { updateProperty } from "../../utils/requests/updateProperty";
import palette from "../../styles/palette";

const AdicionarPropriedade = ({ navigation, route }) => {
  const { propriedadeID = null } = route?.params || {};

  const [ident, setIdent] = useState("");
  const [area, setArea] = useState("");
  const [local, setLocal] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { currentUser } = useAuth();

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
    const fetchPropertyDetails = async () => {
      if (propriedadeID != null) {
        try {
          const propertyDetails = await getPropertyDetails(propriedadeID);
          setIdent(propertyDetails.nome); 
          setArea(propertyDetails.area_total);
          setLocal(propertyDetails.localizacao);
        } catch (error) {
          console.error("Error fetching property details:", error);
        }
      }
    };

    fetchPropertyDetails();
  }, []);



  const handlePropRegister = async () => {
    if (ident && area && local && currentUser) {
      try {
        const propertyData = {
          nome: ident,
          localizacao: local,
          area_total: area,
          usuario_id: currentUser.id,
        };
        const response = await createProperty(propertyData);
        navigation.navigate("Home", {screen:'Properties'});
      } catch (error) {
        console.log("erro cadastrando a propriedade");
      }
    } else {
      console.log("Dados incorretos");
      showFlashMessage("Preeencha os dados corretamente!", "danger");
    }
  };
  const handlePropEdit = async () => {
    if (ident && area && local && currentUser) {
      try {
        const propertyData = {
          nome: ident,
          localizacao: local,
          area_total: area,
          usuario_id: currentUser.id,
        };
        const response = await updateProperty(propriedadeID, propertyData);
        showFlashMessage("Propriedade atualizada com sucesso!", "success");
        navigation.goBack(); // Voltar para a tela anterior após adicionar
      } catch (error) {
        console.log("erro cadastrando a propriedade");
      }
    } else {
      console.log("Dados incorretos");
      showFlashMessage("Preeencha os dados corretamente!", "danger");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // Ajuste para compensar a altura do teclado
      style={{ flex: 1 }}
    >
      {propriedadeID === null ? <Header screenName={"Adicionar Propriedade"} /> : <Header screenName={"Editar Propriedade"} />}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {!keyboardVisible && (
            <Image
              style={styles.logo}
              source={require("../../assets/logo.png")}
            />
          )}

          <View style={[styles.form, keyboardVisible && { marginTop: -180 }]}>
            {propriedadeID !== null && <Text style={styles.text}>Identificação</Text>}
            <TextInput
              placeholder="Identificação"
              value={ident}
              onChangeText={setIdent}
              style={[GlobalStyles.input, styles.input]}
            />
            {propriedadeID !== null && <Text style={styles.text}>Area Total (em tarefas)</Text>}
            <TextInput
              placeholder="Area Total (em tarefas)"
              inputMode="numeric"
              value={area}
              onChangeText={setArea}
              style={[GlobalStyles.input, styles.input]}
            />
            {propriedadeID !== null && <Text style={styles.text}>Localização</Text>}
            <TextInput
              placeholder="Localização"
              multiline
              value={local}
              onChangeText={setLocal}
              style={[GlobalStyles.input, styles.input, styles.local]}
            />

            <TouchableOpacity
              style={GlobalStyles.primaryButton}
              onPress={propriedadeID === null ? handlePropRegister : handlePropEdit}
            >
              <Text style={GlobalStyles.textButton}>{propriedadeID === null ? "Cadastrar Propiedade" : "Editar Propriedade"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  logo: {
    width: 250,
    height: 250,
    marginTop: -140,
  },

  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },

  input: {
    marginVertical: 15,
    height: 50,
  },

  local: {
    height: 100,
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.highlightGreen,
  },
});

export default AdicionarPropriedade;

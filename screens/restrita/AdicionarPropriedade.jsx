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
  Keyboard
} from "react-native";
import { useAuth } from "../../context/AuthContext"; // Certifique-se de ter este hook para obter o usuário autenticado
import Header from "../../components/Header";
import GlobalStyles from "../../styles/global";
import { createProperty } from "../../utils/requests/createProperty";
import { showFlashMessage } from "../../components/Message";

const AdicionarPropriedade = ({ navigation }) => {
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

  const handlePropRegister = async () => {
    if (ident && area && local && currentUser) {
      
      try {
        const propertyData = {nome:ident, localizacao:local, area_total:area, usuario_id:currentUser.id}
      const response = await createProperty(propertyData)
      console.log(response)
      navigation.navigate("Home")
      } catch (error) {console.log("erro cadastrando a propriedade")}
    }else{
      console.log("Dados incorretos")
      showFlashMessage("Preeencha os dados corretamente!", "danger")
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // Ajuste para compensar a altura do teclado
      style={{ flex: 1 }}
    >
      <Header screenName={"Adicionar Propriedade"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {!keyboardVisible && (
            <Image
              style={styles.logo}
              source={require("../../assets/logo.png")}
            />
          )}

          <View style={styles.form}>
            <TextInput
              placeholder="Identificação"
              value={ident}
              onChangeText={setIdent}
              style={[GlobalStyles.input, styles.input]}
            />
            <TextInput
              placeholder="Area Total (em Hectares)"
              value={area}
              onChangeText={setArea}
              style={[GlobalStyles.input, styles.input]}
            />
            <TextInput
              placeholder="Localização"
              multiline
              value={local}
              onChangeText={setLocal}
              style={[GlobalStyles.input, styles.input, styles.local]}
            />

            <TouchableOpacity
              style={GlobalStyles.primaryButton}
              onPress={handlePropRegister}
            >
              <Text style={GlobalStyles.textButton}>Cadastrar Propiedade</Text>
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
});

export default AdicionarPropriedade;

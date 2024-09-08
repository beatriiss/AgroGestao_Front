// src/components/PropertiesScreen.js
import React, { useState } from 'react';
import { View, Image, KeyboardAvoidingView, Platform, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Certifique-se de ter este hook para obter o usuário autenticado
import Header from '../../components/Header';
import GlobalStyles from '../../styles/global';

const AdicionarPropriedade = ({ navigation }) => {

  const [ident, setIdent] = useState("");
  const [area, setArea] = useState("");
  const [local, setLocal] = useState("");

  const handlePropRegister = async () => {
    if (ident && area && loc) {
      try {

      } catch (error) {

      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // Ajuste para compensar a altura do teclado
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Header screenName={"Adicionar Propriedade"} />
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />

          <View style={styles.form}>
            <TextInput
              placeholder="Identificação"
              value={ident}
              onChangeText={setIdent}
              style={[GlobalStyles.input, styles.input]}
            />
            <TextInput
              placeholder="Area Total"
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

            <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handlePropRegister} >
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

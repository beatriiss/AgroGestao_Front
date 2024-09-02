// src/components/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";

const Home = () => {
  const { logout, currentUser } = useAuth();

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
      >
        {/* Inicio do header */}
        <StatusBar backgroundColor={ palette.primaryGreen } translucent={false} />
        <View style={ styles.header }>
          <Text style={ styles.textHeader }>Olá, {currentUser.nome}</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={GlobalStyles.textButton}>Sair</Text>
          </TouchableOpacity>
        </View>
        {/* Fim do header */}


        <View style={ styles.apresentacao} >
          <Text style={ [styles.texto1Apresentacao, styles.textoApresentacao]} >Voçê tem:</Text>
          <Text style={ styles.textoApresentacao} >X Prorpiedades cadastradas</Text> 
          <Text style={ styles.textoApresentacao} >X criações</Text> 
          <Text style={ styles.textoApresentacao} >X Plantações</Text> 
        </View>
        <View style={ styles.logout}>

        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Inicio do style do header
  header: {
    flexDirection: "row",
    backgroundColor: palette.primaryGreen,
    padding: 20,
    justifyContent: "space-between"
  },
  textHeader: {
    color: '#FFFFFF',  
    fontWeight: '600',
    fontSize: 18,
  }, 
  // Fim do Style do header

  apresentacao: {
    padding: 15,
    margin: 20,
    marginTop: 40,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.secondaryGreen,
    borderRadius: 5
  }, 
  textoApresentacao: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  texto1Apresentacao: {
    marginBottom: 30
  },
  logout: {
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Home;

// src/components/InfoScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import { ModalPassword } from '../../components/Modal/ModalPassword';


const Perfil = () => {
  const { logout, currentUser } = useAuth();
  const [nome, setNome] = useState(currentUser.nome)
  const [email, setEmail] = useState(currentUser.email)
  const [password, setPassword] = useState(currentUser.senha)
  const [edit, setEdit] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
    >
      {/* Inicio do header */}
      <StatusBar backgroundColor={palette.primaryGreen} translucent={false} />
      <View style={styles.header}>
        <Text style={styles.textheader}>Olá, {currentUser.nome}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={GlobalStyles.textButton}>Sair</Text>
        </TouchableOpacity>
      </View>
      {/* Fim do header */}


      <View style={styles.container}>
        <Text style={styles.legend} >nome:</Text>
        <TextInput onChangeText={(e) => setNome(e)} style={GlobalStyles.input} placeholder='Nome' editable={edit} value={nome}></TextInput>

        <Text style={styles.legend} >email:</Text>
        <TextInput onChangeText={(e) => setEmail(e)} style={GlobalStyles.input} placeholder='email' editable={edit} value={email}></TextInput>

        <Text style={styles.legend} >senha:</Text>
        <TextInput onChangeText={(e) => setPassword(e)} style={GlobalStyles.input} placeholder='senha' secureTextEntry={!edit} editable={edit} value={password}></TextInput>

        {edit ?
          <TouchableOpacity style={[GlobalStyles.primaryButton, styles.button]} onPress={() => { setEdit(false) }}>
            <Text style={GlobalStyles.textButton}>Salvar!</Text>
          </TouchableOpacity> :
          <TouchableOpacity style={[GlobalStyles.primaryButton, styles.button]} onPress={() => { setModalVisible(true) }}>
            <Text style={GlobalStyles.textButton}>Editar</Text>
          </TouchableOpacity>
        }

      </View>
      <Modal visible={modalVisible} animationType='fade' transparent={true}>
        <ModalPassword editable={() => setEdit(true)} handleClose={() => setModalVisible(false)} />
      </Modal>
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
  textheader: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
  // Fim do Style do header


  container: {
    justifyContent: "center",
    padding: 30
  },
  legend: {
    margin: 15,
    fontWeight: '600',
    fontSize: 18,
  },
  button: {
    marginTop: 50
  }
});
export default Perfil;

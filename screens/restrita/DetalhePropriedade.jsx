import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Certifique-se de ter este hook para obter o usuário autenticado
import { url } from '../../config/url';
import Header from '../../components/Header';
import GlobalStyles from '../../styles/global';
import palette from '../../styles/palette';
import { useFocusEffect } from '@react-navigation/native'; // Importe o useFocusEffect
import { getPropertyDetails } from '../../utils/requests/getPropertyDetails';
const AdicionarPropriedade = ({ navigation, route }) => {
  const [propertie, setPropertie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  console.log(route.params)

  // Função para buscar AdicionarPropriedade do usuário
  const fetchPropertie = async () => {
    try {
      const response = await getPropertyDetails(route?.params?.propriedadeID)
      console.log(response)
    } catch (error) {
      console.error('Erro ao buscar AdicionarPropriedade:', error);
    } finally {
      setLoading(false);
    }
  };

  // Usar useFocusEffect para buscar dados ao abrir a tela
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Exibir o estado de carregamento sempre que a tela for reaberta
      fetchPropertie();
    }, [currentUser.id])
  );


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // Ajuste para compensar a altura do teclado
      style={{ flex: 1 }}
    >
      <Header screenName={"Detalhe da Propriedade"} />
      <View style={styles.container}>
       
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
 
});

export default AdicionarPropriedade;

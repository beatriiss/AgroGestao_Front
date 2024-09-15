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



const DetalhesPropriedade = ({ navigation, route }) => {
  const [propertie, setPropertie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  console.log(route.params)

  // Função para buscar AdicionarPropriedade do usuário
  const fetchPropertie = async () => {
    try {
      setPropertie(await getPropertyDetails(route?.params?.propriedadeID));
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
        <View style={styles.dados}>
          <Text style={styles.textProp}>Dados da propriedade: {propertie.nome}</Text>
          <Text style={styles.text}>Localização: {propertie.localizacao}</Text>
          <Text style={styles.text}>Area Total: {propertie.area_total}</Text>
        </View>

        <View style={styles.dados}>
          <Text style={styles.textProp}>Criações dessa propriedade:</Text>
          <View style={styles.dados}>

          </View>
        </View>

        <View style={styles.dados}>
          <Text style={styles.textProp}>Culturas dessa propriedade:</Text>
          <View style={styles.dados}>

          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },

  dados: {
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: palette.primaryGreen,
  },

  textProp: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "600",
  },
  
  text: {
    fontSize: 20,
  },
});

export default DetalhesPropriedade;

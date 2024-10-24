// src/components/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // Importe o useFocusEffect
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import axios from 'axios';
import { url } from '../../config/url';
import { useAuth } from "../../context/AuthContext";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import Header from "../../components/Header";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const propIcon = require('../../assets/icon_green.png');

const Home = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [datalhes, setdatalhes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();


  // Função para buscar propriedades do usuário
  const fetchData = async () => {
    try {
      const propertieResponse = await axios.get(`${url}/properties/user/${currentUser.id}`);
      const detailResponse = await axios.get(`${url}/users/totalInfo/${currentUser.id}`);
      setProperties(propertieResponse.data.property);
      setdatalhes(detailResponse.data[0]);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Usar useFocusEffect para buscar dados ao abrir a tela
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Exibir o estado de carregamento sempre que a tela for reaberta
      fetchData();
    }, [currentUser.id])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
    >
      <Header screenName={"Home"} />

      <View style={styles.detalhes} >
        <Text style={[styles.titulo, styles.texto]} >Voçê tem:</Text>
        <Text style={styles.texto} >{properties.length} Prorpiedades cadastradas</Text>
        <Text style={styles.texto} >{datalhes.total_criacoes} criações</Text>
        <Text style={styles.texto} >{datalhes.total_culturas} Plantações</Text>
      </View>
      <View style={styles.container}>
        <Text style={[styles.titulo, styles.texto]} >As suas prorpiedades</Text>
        {properties.length === 0 ? (
          <View style={styles.centered}>
            <Text>Ainda não há propriedades cadastradas.</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.propertyCard} onPress={() => navigation.navigate("DetalhePropriedade", { propriedadeID: item.id })} >
                  <Text style={styles.propertyText}>{item.nome}</Text>
                  <Image
                    source={propIcon} 
                    style={styles.PropIcon} 
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
              style={styles.flatList}
              overScrollMode="never"
            />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({


  detalhes: {
    padding: 15,
    marginTop: 40,
    marginBottom: 20,
    marginHorizontal: 20,
    justifyContent: "center",
    borderColor: palette.highlightGreen,
    borderWidth: 3,
    borderRadius: 8,
  },
  texto: {
    fontSize: 20,
    width: "90%",
    fontWeight: "600",
  },
  titulo: {
    marginBottom: 20,
  },
  container: {
    marginHorizontal: 20,
  },
  propertyCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderColor: palette.highlightGreen,
    borderWidth: 3,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
  propertyText: {
    fontSize: 20,
    width: "90%",
    fontWeight: "600",
  },
  PropIcon: {
    width: 22,
    height: 28,
  },
});

export default Home;

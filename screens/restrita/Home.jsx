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
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from 'axios';
import { url } from '../../config/url';
import { useAuth } from "../../context/AuthContext";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import Header from "../../components/Header";

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

  if (loading) {
    // Mostrar loader enquanto os dados estão sendo carregados
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={palette.primaryGreen} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
      style={{ flex: 1 }}
    >
      <Header screenName={"Home"} />

      <View style={styles.detalhes}>
        <Text style={[styles.titulo, styles.texto]}>Você tem:</Text>
        <Text style={styles.texto}>{properties.length} Propriedades cadastradas</Text>
        <Text style={styles.texto}>{datalhes?.total_criacoes || 0} Criações</Text>
        <Text style={styles.texto}>{datalhes?.total_culturas || 0} Plantações</Text>
      </View>

      <View style={styles.container}>
        {properties.length > 0 && (
          <Text style={[styles.titulo, styles.texto]}>
            Essas são as suas propriedades
          </Text>
        )}

        {properties.length === 0 && (!datalhes || Object.keys(datalhes).length === 0) ? (
          <View style={styles.centered}>
            <Text style={styles.texto}>Ainda não há propriedades cadastradas.</Text>
            <TouchableOpacity style={GlobalStyles.primaryButton} onPress={() => navigation.navigate("AdicionarPropriedade")}>
              <Text style={GlobalStyles.textButton}>Adicionar Nova Propriedade</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.propertyCard}
                onPress={() =>
                  navigation.navigate("DetalhePropriedade", {
                    propriedadeID: item.id,
                  })
                }
              >
                <Text style={styles.propertyText}>{item.nome}</Text>
                <Image source={propIcon} style={styles.PropIcon} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            style={styles.flatList}
            overScrollMode="never"
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: palette.primaryGreen,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Home;

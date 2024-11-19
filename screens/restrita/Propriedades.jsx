import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Certifique-se de ter este hook para obter o usuário autenticado
import { url } from '../../config/url';
import Header from '../../components/Header';
import GlobalStyles from '../../styles/global';
import palette from '../../styles/palette';
import { useFocusEffect } from '@react-navigation/native'; // Importe o useFocusEffect
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getPropertyCreations } from '../../utils/requests/getPropertyCreations';
import { getPropertyCultivations } from '../../utils/requests/getPropertyCultivations';

const propIcon = require('../../assets/icon_green.png');

const Propriedades = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Função para buscar propriedades do usuário
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${url}/properties/user/${currentUser.id}`);
      const fetchedProperties = response.data.property;

      // Objeto para armazenar as criações e culturas associadas ao ID da propriedade
      const details = {};

      await Promise.all(fetchedProperties.map(async (prop) => {
        const creations = await getPropertyCreations(prop.id);
        const cultivations = await getPropertyCultivations(prop.id);

        // Associando as criações e culturas ao ID da propriedade
        details[prop.id] = {
          creations,
          cultivations,
        };
      }));

      // Salvando o objeto no estado
      setProperties(fetchedProperties);
      setPropertyDetails(details);
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
      fetchProperties();
    }, [currentUser.id])
  );

  const handleAddProperty = () => {
    // Navegar para a tela de adicionar propriedade
    navigation.navigate('AdicionarPropriedade');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={palette.primaryGreen} size={'large'}/>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // Ajuste para compensar a altura do teclado
      style={{ flex: 1 }}
    >
      <Header screenName={"Propriedades"} />
      <View style={styles.container}>
        {properties.length === 0 ? (
          <View style={styles.centered}>
            <Text style={{fontSize:16, fontWeight:'600'}}>Ainda não há propriedades cadastradas.</Text>
          </View>
        ) : (
          <>
            <Text style={{
              fontSize: 20, paddingHorizontal: 20, paddingVertical: 10, fontWeight: '600'
            }}>Essas são as suas propriedades:</Text>
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.propertyCard} onPress={() => navigation.navigate("DetalhePropriedade", { propriedadeID: item.id })} >
                  <View style={styles.propertyIdent}>
                    <Text style={styles.propertyText}>{item.nome}</Text>
                    <Image
                    source={propIcon} 
                    style={styles.PropIcon} 
                  />
                  </View>
                  <View style={styles.propertyInfo}>
                    <View style={{alignItems: "center"}}>
                      <Text style={styles.text} >Criações</Text>
                      <Text style={styles.text} >{propertyDetails[item.id].creations.length}</Text>
                    </View>
                    <View style={{alignItems: "center"}}>
                      <Text style={styles.text} >Plantações</Text>
                      <Text style={styles.text} >{propertyDetails[item.id].cultivations.length}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
              style={styles.flatList}
              overScrollMode="never"
            />
          </>
        )}
        {/* Botão fixo na parte inferior da tela */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleAddProperty}>
            <Text style={GlobalStyles.textButton}>Adicionar Nova Propriedade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -200
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 10

  },
  flatList: {
    flex: 1,
    marginBottom: 200,

  },
  propertyCard: {
    backgroundColor: '#fff', // Use a cor secundária desejada
    padding: 8,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5,
    borderColor: palette.highlightGreen,
    borderWidth: 2,
  },
  propertyText: {
    fontSize: 20,
    width: "90%",
    fontWeight: "600",
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 110,
    width: '100%',
  },
  propertyIdent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  propertyInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop:10
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.highlightGreen
  },
  PropIcon: {
    width: 22,
    height: 28,
  },
});

export default Propriedades;

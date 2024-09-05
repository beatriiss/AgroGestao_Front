// src/components/PropertiesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Certifique-se de ter este hook para obter o usuário autenticado
import { url } from '../../config/url';
import Header from '../../components/Header';
import GlobalStyles from '../../styles/global';
import palette from '../../styles/palette';
const Propriedades = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Função para buscar propriedades do usuário
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${url}/properties/user/${currentUser.id}`);
        setProperties(response.data.property);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar propriedades:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentUser.id]);

  const handleAddProperty = () => {
    // Navegar para a tela de adicionar propriedade
    navigation.navigate('AdicionarPropriedade');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header screenName={"Propriedades"} />
      {properties.length === 0 ? (
        <View style={styles.centered}>
          <Text>Ainda não há propriedades cadastradas.</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.propertyCard}>
              <Text style={styles.propertyText}>{item.nome}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      {/* Botão fixo na parte inferior da tela */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[GlobalStyles.primaryButton, {bottom: 120}]} onPress={handleAddProperty}>
          <Text style={GlobalStyles.textButton}>Adicionar Nova Propriedade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    marginTop:30  },
  propertyCard: {
    backgroundColor: '#fff', // Use a cor secundária desejada
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 1, height:10 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5,
    borderColor:palette.highlightGreen,
    borderWidth:2
    
  },
  propertyText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    backgroundColor: '#007bff', // Use a cor desejada para o botão
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    bottom: 120
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Propriedades;

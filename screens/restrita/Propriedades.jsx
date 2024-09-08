import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Certifique-se de ter este hook para obter o usuário autenticado
import { url } from '../../config/url';
import Header from '../../components/Header';
import GlobalStyles from '../../styles/global';
import palette from '../../styles/palette';
import { useFocusEffect } from '@react-navigation/native'; // Importe o useFocusEffect

const Propriedades = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Função para buscar propriedades do usuário
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${url}/properties/user/${currentUser.id}`);
      setProperties(response.data.property);
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
        <Text>Carregando...</Text>
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
            <Text>Ainda não há propriedades cadastradas.</Text>
          </View>
        ) : (
          <>
          <Text style={{fontSize:18, paddingHorizontal:20, paddingVertical:10, fontWeight:'600'
          }}>Essas são as suas propriedades:</Text>
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.propertyCard} onPress={()=> navigation.navigate("DetalhePropriedade", {propriedadeID: item.id})} >
                <Text style={styles.propertyText}>{item.nome}</Text>
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
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal:10

  },
  flatList: {
    flex: 1,
    marginBottom: 200, 

  },
  propertyCard: {
    backgroundColor: '#fff', // Use a cor secundária desejada
    padding: 16,
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
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 110,
    width: '100%',
  },
});

export default Propriedades;

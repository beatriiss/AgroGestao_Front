// src/components/PropertiesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Certifique-se de ter este hook para obter o usuário autenticado
import { url } from '../../config/url';
import Header from '../../components/Header';
import GlobalStyles from '../../styles/global';
import palette from '../../styles/palette';

const AdicionarPropriedade = ({ navigation }) => {
 
  return (
    <View style={styles.container}>
      <Header screenName={"Adicionar Propriedade"} />
    
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

export default AdicionarPropriedade;

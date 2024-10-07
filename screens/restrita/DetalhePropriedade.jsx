import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; 
import { useAuth } from "../../context/AuthContext";
import { getPropertyDetails } from "../../utils/requests/getPropertyDetails";
import { getPropertyCreations } from "../../utils/requests/getPropertyCreations";
import Header from "../../components/Header";
import CardCriacoes from "../../components/CardCriacoes";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const DetalhesPropriedade = ({ navigation, route }) => {
  const [property, setProperty] = useState(null);
  const [creations, setCreations] = useState(null);
  const [cultures, setCultures] = useState(null); // Culturas
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [index, setIndex] = useState(0); // Índice da aba ativa
  const [routes] = useState([
    { key: 'creations', title: 'Criações' },
    { key: 'cultures', title: 'Cultivos' },
  ]);

  const fetchPropertie = async () => {
    try {
      setProperty(await getPropertyDetails(route?.params?.propriedadeID));
      setCreations(await getPropertyCreations(route?.params?.propriedadeID));
      // Aqui você faria uma requisição para obter as culturas, se aplicável.
      // setCultures(await getPropertyCultures(route?.params?.propriedadeID));
    } catch (error) {
      console.error("Erro ao buscar a dados da propriedade:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPropertie();
    }, [currentUser.id])
  );

  const renderCriacoes = () => {
    if (!creations || creations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma criação cadastrada.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("AdicionarCriacao", {
                propriedadeID: property.id,
              })
            }
          >
            <Text style={styles.addButtonText}>Adicionar Criação</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{paddingHorizontal:20, height:"95%", gap:20}}>
     
        <FlatList
          data={creations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardCriacoes item={item} />}
          overScrollMode="never"
          
        />
        <TouchableOpacity
          style={GlobalStyles.primaryButton}
          onPress={() =>
            navigation.navigate("AdicionarCriacao", {
              propriedadeID: property.id,
            })
          }
        >
          <Text style={GlobalStyles.textButton}>Adicionar Criação</Text>
        </TouchableOpacity>
      
      </View>
    );
  };

  const renderCulturas = () => {
    if (!cultures || cultures.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma cultura cadastrada.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("AdicionarCultura", {
                propriedadeID: property.id,
              })
            }
          >
            <Text style={styles.addButtonText}>Adicionar Cultura</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Exemplo: Lista de culturas
    return (
      <FlatList
        data={cultures}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.nome}</Text>}
      />
    );
  };

  // Definindo as cenas para as abas
  const renderScene = SceneMap({
    creations: renderCriacoes,
    cultures: renderCulturas,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <Header screenName={"Detalhe da Propriedade"} />
      <View style={styles.container}>
        <View style={styles.dados}>
          <Text style={styles.title}>{property?.nome}</Text>
          <View style={styles.iconRow}>
            <Text style={styles.text}>Localização: {property?.localizacao}</Text>
            <TouchableOpacity>
              <FontAwesome5 name="map-marked-alt" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <Text style={styles.text}>Área Total: {property?.area_total}</Text>
            <TouchableOpacity>
              <FontAwesome name="area-chart" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* TabView para alternar entre Criações e Culturas */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Platform.OS === "ios" ? 375 : 360 }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: palette.primaryGreen }}
              style={{ backgroundColor: '#f1f1f1', marginBottom:20, decoration:'none', elevation:0 }}
              labelStyle={{ color: palette.highlightGreen, fontSize: 16 }}
            />
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dados: {
    marginHorizontal: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: palette.primaryGreen,
    marginVertical: 10,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row-reverse',
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: palette.highlightGreen,
  },
  text: {
    fontSize: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: palette.primaryGreen,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DetalhesPropriedade;

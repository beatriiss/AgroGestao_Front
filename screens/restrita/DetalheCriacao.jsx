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
import { getCreationsDetails } from "../../utils/requests/getCriationDetails";
import Header from "../../components/Header";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Octicons from '@expo/vector-icons/Octicons';
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import CardVacina from "../../components/cardVacinas";
import { buscarVacinas } from "../../utils/requests/buscarVacinas";
const DetalheCriacao = ({ navigation, route }) => {
  const [creation, setCreation] = useState(null);
  const [vaccines, setVaccines] = useState([]); // Vacinas
  const [history, setHistory] = useState([]); // Histórico
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'vaccines', title: 'Vacinas' },
    { key: 'history', title: 'Histórico' },
  ]);

  const fetchPropertie = async () => {
    try {
      console.log("ID:::", route?.params?.CriacaoID);
      setCreation(await getCreationsDetails(route?.params?.CriacaoID));
      // TODO: Fetch vaccines and history data here
      setVaccines(await buscarVacinas(route?.params?.CriacaoID));

      // setHistory(await fetchHistory(route?.params?.CriacaoID));
    } catch (error) {
      console.error("Erro ao buscar a dados da criacao:", error);
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

  const renderVacinas = () => {
    if (!vaccines || vaccines.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma vacina cadastrada.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("AdicionarVacina", {
                creationID: creation.id,
              })
            }
          >
            <Text style={styles.addButtonText}>Adicionar Vacina</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, height: "95%", gap: 20 }}>
        <FlatList
          data={vaccines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardVacina vacina={item} onDelete={fetchPropertie}/>} // Update this to your actual component
          overScrollMode="never"
        />
        <TouchableOpacity
          style={GlobalStyles.primaryButton}
          onPress={() =>
            navigation.navigate("AdicionarVacina", {
              creationID: creation.id,
            })
          }
        >
          <Text style={GlobalStyles.textButton}>Adicionar Vacina</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHistorico = () => {
    if (!history || history.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ainda não existe histórico para essa criação.</Text>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, height: "95%", gap: 20 }}>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardHistorico item={item} />} // Update this to your actual component
          overScrollMode="never"
        />
      </View>
    );
  };

  const renderScene = SceneMap({
    vaccines: renderVacinas,
    history: renderHistorico,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <Header screenName={creation?.nome} />
      <View style={styles.container}>
        <View style={styles.dados}>
          <View style={styles.edit}>
            <Text style={styles.title}>{creation?.especie}</Text>
            <TouchableOpacity style={styles.editIcon}
              onPress={() =>
                navigation.navigate("AdicionarCriacao", {
                  criacaoID: creation.id,
                })
              }
            >
              <FontAwesome5 name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <Text style={styles.text}>Quantidade de animais: {creation?.numero_animais}</Text>
            <TouchableOpacity>
              <Octicons name="number" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <Text style={styles.text}>Peso médio: {creation?.peso_medio}</Text>
            <TouchableOpacity>
              <FontAwesome6 name="weight-scale" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Platform.OS === "ios" ? 375 : 360 }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: palette.primaryGreen }}
              style={{ backgroundColor: '#f1f1f1', marginBottom: 20, decoration: 'none', elevation: 0 }}
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
    marginVertical: 20,
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
  edit: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
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

export default DetalheCriacao;

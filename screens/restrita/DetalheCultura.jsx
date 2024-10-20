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
import { getCultivationDetails } from "../../utils/requests/getCultivationDetails";
import Header from "../../components/Header";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Octicons from '@expo/vector-icons/Octicons';
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

import moment from "moment";
const DetalheCultura = ({ navigation, route }) => {
  const [cultivation, setCultivation] = useState(null);
  const [bioinsumos, setBioinsumos] = useState([]); // Bioinsumos
  const [informacoes, setInformacoes] = useState([]); // Informações
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'bioinsumos', title: 'Bioinsumos' },
    { key: 'informacoes', title: 'Informações' },
  ]);

  const fetchPropertie = async () => {
    try {
      console.log("ID:::", route?.params?.CultivoID);
      setCultivation(await getCultivationDetails(route?.params?.CultivoID));
      // TODO: Fetch bioinsumos and informacoes data here
      // setBioinsumos(await fetchBioinsumos(route?.params?.CriacaoID));
      // setInformacoes(await fetchInformacoes(route?.params?.CriacaoID));
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

  const renderBioinsumos = () => {
    if (!bioinsumos || bioinsumos.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum bioinsumo cadastrado.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("AdicionarBioinsumo", {
                cultivationID: creation.id,
              })
            }
          >
            <Text style={styles.addButtonText}>Adicionar Bioinsumo</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, height: "95%", gap: 20 }}>
        <FlatList
          data={bioinsumos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardBioinsumos item={item} />} // Update this to your actual component
          overScrollMode="never"
        />
        <TouchableOpacity
          style={GlobalStyles.primaryButton}
          onPress={() =>
            navigation.navigate("AdicionarBioinsumo", {
              criationID: creation.id,
            })
          }
        >
          <Text style={GlobalStyles.textButton}>Adicionar Bioinsumo</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInformacoes = () => {
    if (!informacoes || informacoes.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ainda não existe informações para essa criação.</Text>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, height: "95%", gap: 20 }}>
        <FlatList
          data={informacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardInformacoes item={item} />} // Update this to your actual component
          overScrollMode="never"
        />
      </View>
    );
  };

  const renderScene = SceneMap({
    bioinsumos: renderBioinsumos,
    informacoes: renderInformacoes,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <Header screenName={cultivation?.nome} />
      <View style={styles.container}>
        <View style={styles.dados}>
          <View style={styles.edit}>
            <Text style={styles.title}>{cultivation?.tipo}</Text>
            <TouchableOpacity style={styles.editIcon}
              onPress={() =>
                navigation.navigate("AdicionarCultura", {
                  cultivoID: cultivation.id,
                })
              }
            >
              <FontAwesome5 name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <Text style={styles.text}>Area Plantada: {cultivation?.area_plantada} tarefas</Text>
            <TouchableOpacity>
              <FontAwesome name="area-chart" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <Text style={styles.text}>Data de plantio: {cultivation ? moment(cultivation.data_plantio).format("DD/MM/YYYY") : "sem data"}</Text>
            <TouchableOpacity>
              <FontAwesome6 name="calendar" size={24} color="black" />
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

export default DetalheCultura;

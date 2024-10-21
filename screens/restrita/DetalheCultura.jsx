import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert
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
import { getBioinsumos } from "../../utils/requests/getBioinsumos";
import moment from "moment";
import CardBioinsumo from "../../components/cardBioinsumos";
import { dropCultivation } from "../../utils/requests/dropCultivation";
import { showFlashMessage } from "../../components/Message";
import especiesComuns from "../../info/cultivos.json";
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
      setBioinsumos(await getBioinsumos(route?.params?.CultivoID));
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
                cultivoID: cultivation.id,
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
          renderItem={({ item }) => <CardBioinsumo item={item} onDelete={fetchPropertie}/>} // Update this to your actual component
          overScrollMode="never"
        />
        <TouchableOpacity
          style={GlobalStyles.primaryButton}
          onPress={() =>
            navigation.navigate("AdicionarBioinsumo", {
              cultivoID: creation.id,
            })
          }
        >
          <Text style={GlobalStyles.textButton}>Adicionar Bioinsumo</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInformacoes = () => {
    let cultivo = cultivation?.tipo; 
    console.log("tipo", cultivo); // Renomeado para cultivo

    // Use a variável cultivo para acessar o objeto
    const especie = especiesComuns.culturas[cultivo]; 

    console.log("informacoes:::", especie);

    if (!especie) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#666" }}>Não existem informações disponíveis para essa espécie.</Text>
        </View>
      );
    }
  
    return (
      <View style={{ paddingHorizontal: 20, height: "95%", gap: 20 }}>
        <View style={{ padding: 15, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Nome: <Text style={{ fontWeight: "normal" }}>{cultivation?.tipo}</Text></Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Melhor data para plantio: <Text style={{ fontWeight: "normal" }}>{especie.melhor_data_plantio}</Text></Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Bioinsumos recomendados: <Text style={{ fontWeight: "normal" }}>{especie.bioinsumos_recomendados.join(", ")}</Text></Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Clima ideal: <Text style={{ fontWeight: "normal" }}>{especie.clima_ideal}</Text></Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Tempo para colheita: <Text style={{ fontWeight: "normal" }}>{especie.tempo_para_colheita}</Text></Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Necessidade hídrica: <Text style={{ fontWeight: "normal" }}>{especie.necessidade_hidrica}</Text></Text>
        </View>
      </View>
    );
  };
  
  

  const renderScene = SceneMap({
    bioinsumos: renderBioinsumos,
    informacoes: renderInformacoes,
  });

  const handleDelete = async () => {
    Alert.alert(
      'Confirmação de Exclusão',
      'Tem certeza de que deseja deletar esta criação?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Exclusão cancelada'),
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await dropCultivation(cultivation.id);
              console.log('Criação deletada com sucesso');
              showFlashMessage("Cultivo deletado.", "danger")
              navigation.goBack()
            } catch (error) {
              console.error('Erro ao deletar criação:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <Header screenName={cultivation?.nome} />
      <View style={styles.container}>
        <View style={styles.dados}>
        <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
              <Text style={styles.title}>{cultivation?.tipo}</Text>
          <View style={styles.edit}>
          
            <TouchableOpacity style={styles.editIcon}
              onPress={() =>
                navigation.navigate("AdicionarCultura", {
                  cultivoID: cultivation.id,
                })
              }
            >
              <FontAwesome5 name="edit" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.editIcon}
                onPress={handleDelete}
              >
                <FontAwesome5 name="trash" size={24} color={palette.danger} />
              </TouchableOpacity>
          </View>
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
    justifyContent: "flex-end",
    alignItems: "center",
    gap:10
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

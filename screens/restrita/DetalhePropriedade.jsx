import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
  ScrollView,
  Image
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { getPropertyDetails } from "../../utils/requests/getPropertyDetails";
import { getPropertyCreations } from "../../utils/requests/getPropertyCreations";
import { getPropertyCultivations } from "../../utils/requests/getPropertyCultivations";
import Header from "../../components/Header";
import CardCriacoes from "../../components/CardCriacoes";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CardCultivos from "../../components/CardCultivos";
import { dropProperty } from "../../utils/requests/dropProperty";
import { showFlashMessage } from "../../components/Message";

const DetalhesPropriedade = ({ navigation, route }) => {
  const [property, setProperty] = useState(null);
  const [creations, setCreations] = useState(null);
  const [cultures, setCultures] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("creations"); // Aba ativa

  const fetchPropertie = async () => {
    try {
      setProperty(await getPropertyDetails(route?.params?.propriedadeID));
      setCreations(await getPropertyCreations(route?.params?.propriedadeID));
      setCultures(await getPropertyCultivations(route?.params?.propriedadeID));
    } catch (error) {
      console.error("Erro ao buscar os dados da propriedade:", error);
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
<View style={{ flex: 1, paddingHorizontal: 20 }}>
  <FlatList
    data={creations}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <CardCriacoes item={item} />}
    overScrollMode="never"
    contentContainerStyle={{ paddingBottom: 80 }} // Espaço para o botão fixo
  />

  <TouchableOpacity
    style={[
      GlobalStyles.primaryButton,
      {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
      },
    ]}
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

    return (
<View style={{ flex: 1, paddingHorizontal: 20 }}>
  <FlatList
    data={cultures}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <CardCultivos item={item} />}
    overScrollMode="never"
    contentContainerStyle={{ paddingBottom: 80 }} // Espaço para o botão fixo
  />

  <TouchableOpacity
    style={[
      GlobalStyles.primaryButton,
      {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
      },
    ]}
    onPress={() =>
      navigation.navigate("AdicionarCultura", {
        propriedadeID: property.id,
      })
    }
  >
    <Text style={GlobalStyles.textButton}>Adicionar Cultivo</Text>
  </TouchableOpacity>
</View>

    );
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmação de Exclusão",
      "Tem certeza de que deseja deletar esta Propriedade e todas as criações e cultivos ligadas a ela?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Exclusão cancelada"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await dropProperty(property.id);
              console.log("Criação deletada com sucesso");
              showFlashMessage("Criação deletada.", "danger");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao deletar criação:", error);
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
      <Header screenName={"Detalhe da Propriedade"} />
      <View style={styles.container}>
        <View style={styles.dados}>
          <View style={styles.edit}>
            <Text style={styles.title}>{property?.nome}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 15,
              }}
            >
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() =>
                  navigation.navigate("AdicionarPropriedade", {
                    propriedadeID: property.id,
                  })
                }
              >
                                <Image
                source={require("../../assets/edit.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
                resizeMode="contain"
              />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete}>
                <Image
                source={require("../../assets/trash.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
                resizeMode="contain"
              />
          </TouchableOpacity>
            </View>
          </View>
          <View style={styles.iconRow}>
            <Text style={{fontSize:18}}>
              Localização: {"\n"}
              {property?.localizacao}
            </Text>
            <TouchableOpacity>
              <FontAwesome5 name="map-marked-alt" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <Text style={{fontSize:18}}>Área Total: {property?.area_total}</Text>
            <TouchableOpacity>
              <FontAwesome name="area-chart" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Alternador de abas */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "creations" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("creations")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "creations" && styles.activeTabText,
              ]}
            >
              CRIAÇÕES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "cultures" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("cultures")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "cultures" && styles.activeTabText,
              ]}
            >
              CULTIVOS
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "creations" ? renderCriacoes() : renderCulturas()}

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  dados: {
    marginHorizontal: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: palette.primaryGreen,
    marginVertical: 20,
    gap:5
  },
  edit: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "600", color: palette.highlightGreen },
  iconRow: { flexDirection: "row-reverse", justifyContent: "flex-end", alignItems: "center", gap: 10 },
  tabContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10, width:'100%' },
  tabButton: { padding: 10, borderBottomWidth: 2, borderBottomColor: "transparent", width:'50%', display:'flex', alignItems:'center', justifyContent:'center'},
  activeTabButton: { borderBottomColor: palette.primaryGreen },
  tabText: { fontSize: 16, color: "gray", textAlign:'center' },
  activeTabText: { color: palette.highlightGreen, fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop:-150},
  emptyText: { fontSize: 18, color: "gray" },
  addButton: { marginTop: 10, backgroundColor: palette.primaryGreen, padding: 10, borderRadius: 5 },
  addButtonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});

export default DetalhesPropriedade;

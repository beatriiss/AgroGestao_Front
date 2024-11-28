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
  Image
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { getCreationsDetails } from "../../utils/requests/getCriationDetails";
import Header from "../../components/Header";
import palette from "../../styles/palette";
import GlobalStyles from "../../styles/global";
import Octicons from "@expo/vector-icons/Octicons";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import CardVacina from "../../components/cardVacinas";
import { buscarVacinas } from "../../utils/requests/buscarVacinas";
import { dropCreation } from "../../utils/requests/dropCreation";
import { showFlashMessage } from "../../components/Message";
import { getHistoryCreation } from "../../utils/requests/getHistoryCreation";
import CardHistorico from "../../components/cardHistorico";

const DetalheCriacao = ({ navigation, route }) => {
  const [creation, setCreation] = useState(null);
  const [vaccines, setVaccines] = useState([]); // Vacinas
  const [history, setHistory] = useState([]); // Histórico
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "vaccines", title: "VACINAS" },
    { key: "history", title: "HISTÓRICO" },
  ]);

  const fetchPropertie = async () => {
    try {
      console.log("ID:::", route?.params?.CriacaoID);
      setCreation(await getCreationsDetails(route?.params?.CriacaoID));
      // TODO: Fetch vaccines and history data here
      setVaccines(await buscarVacinas(route?.params?.CriacaoID));
      setHistory(await getHistoryCreation(route?.params?.CriacaoID));
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

  const handleDelete = async () => {
    Alert.alert(
      "Confirmação de Exclusão",
      "Tem certeza de que deseja deletar esta criação?",
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
              await dropCreation(creation.id);
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
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlatList
          data={vaccines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardVacina vacina={item} onDelete={fetchPropertie} />
          )}
          overScrollMode="never"
          contentContainerStyle={{ paddingBottom: 80 }} // Adiciona espaço para o botão não sobrepor os itens
        />
        <TouchableOpacity
          style={[
            GlobalStyles.primaryButton,
            { position: "absolute", bottom: 20, left: 20, right: 20 },
          ]}
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
          <Text style={styles.emptyText}>
            Ainda não existe histórico para essa criação.
          </Text>
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <Header screenName={creation?.nome} />
      <View style={styles.container}>
        <View style={styles.dados}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.title}>{creation?.especie}</Text>
            <View style={styles.edit}>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() =>
                  navigation.navigate("AdicionarCriacao", {
                    criacaoID: creation.id,
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
              <TouchableOpacity style={styles.editIcon} onPress={handleDelete}>
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
            <Text style={styles.text}>
              Quantidade de animais: {creation?.numero_animais}
            </Text>
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

        <View style={styles.tabButtonsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, index === 0 && styles.activeTabButton]}
            onPress={() => setIndex(0)}
          >
            <Text
              style={[
                styles.tabButtonText,
                index === 0 && styles.activeTabButtonText,
              ]}
            >
              VACINAS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, index === 1 && styles.activeTabButton]}
            onPress={() => setIndex(1)}
          >
            <Text
              style={[
                styles.tabButtonText,
                index === 1 && styles.activeTabButtonText,
              ]}
            >
              HISTÓRICO
            </Text>
          </TouchableOpacity>
        </View>

        {index === 0 ? renderVacinas() : renderHistorico()}
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
    flexDirection: "row-reverse",
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
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
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
  tabButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: palette.primaryGreen,
  },
  tabButtonText: {
    fontSize: 18,
    color: "gray",
  },
  activeTabButtonText: {
    color: palette.highlightGreen,
    fontWeight: "bold",
  },
});

export default DetalheCriacao;

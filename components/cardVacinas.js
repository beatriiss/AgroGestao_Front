import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
  Button
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import palette from "../styles/palette";
import moment from "moment";
import { buscarDoses } from "../utils/requests/buscarDoses";
import { dropVaccine } from "../utils/requests/dropVaccine";
import { atualizarStatusDose } from "../utils/requests/updateDose";
const CardVacina = ({ vacina, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [doses, setDoses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoDoseId, setPhotoDoseId] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [load, setLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoses = async () => {
      setIsLoading(true);
      try {
        const response = await buscarDoses(vacina.id);
        setDoses(response);
      } catch (error) {
        console.error("Erro ao obter as doses:", error);
      }finally {
        setIsLoading(false);
      }
    };

    fetchDoses();
  }, [vacina.id]);

  const getStatusColor = (dose) => {
    const dataAplicacao = moment(dose.data_aplicacao);
    const hoje = moment();

    if (dose.concluido) {
      return { backgroundColor: palette.primaryGreen, label: "Concluída" };
    } else if (dataAplicacao.isAfter(hoje)) {
      return { backgroundColor: palette.secondaryGreen, label: "Agendada" };
    } else {
      return { backgroundColor: palette.danger, label: "Atrasada" };
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDoseStatus = async (doseId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await atualizarStatusDose(doseId, updatedStatus);
      setDoses(
        doses.map((dose) =>
          dose.id === doseId ? { ...dose, concluido: updatedStatus } : dose
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar a dose:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dropVaccine(vacina.id);
      onDelete();
    } catch (error) {
      console.error("Erro ao deletar o protocolo:", error);
    }
  };

  
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={toggleExpand} style={styles.deleteButton}>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <Text style={styles.tipoText}>{vacina.nome_vacina} ({vacina.nome})</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.tipoContainer}>
          <Ionicons name="trash-bin" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.expandableContainer}>
          {isLoading?(<ActivityIndicator size="large" color={palette.green} />):<>
          <Text style={styles.label}>Doses:</Text>
          {doses.map((dose, index) => (
            <View key={index} style={styles.doseContainer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleDoseStatus(dose.id, dose.concluido)}
                >
                  {dose.concluido ? (
                    <Ionicons name="checkbox" size={24} color={palette.green} />
                  ) : (
                    <Ionicons name="square-outline" size={24} color="black" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.doseText}>
                {moment(dose.data_aplicacao).format("DD/MM/YYYY")}
              </Text>
              <View
                style={[
                  styles.tag,
                  { backgroundColor: getStatusColor(dose).backgroundColor },
                ]}
              >
                <Text style={styles.tagText}>{getStatusColor(dose).label}</Text>
              </View>


            </View>
          ))}
          </> }
          
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginVertical:10
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandableContainer: {
    marginTop: 10,
  },
  doseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  doseText: {
    flex: 1,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo opaco com 50% de opacidade
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "95%",
    marginLeft: 10,
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: palette.red,
    padding: 10,
    borderRadius: 5,
    height: 50,
    width: 320,
  },
  closeText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  photo: {
    width: 300,
    height: 250,
    marginTop: 10,
  },
  tipoText:{
    fontWeight:'600',
    fontSize:15
  }
});

export default CardVacina;
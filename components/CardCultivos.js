import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import palette from "../styles/palette";
import moment from "moment";
import { TouchableOpacity } from "react-native";
const especiesComuns = {
  Abóbora: require("../assets/cultivos/abobora.png"),
  Aipim: require("../assets/cultivos/aipim.png"),
  Laranja: require("../assets/cultivos/laranja.png"),
  Melancia: require("../assets/cultivos/melancia.png"),
  Amendoim: require("../assets/cultivos/amendoim.png"),
  Milho: require("../assets/cultivos/milho.png")
};

const CardCriacoes = ({ item }) => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();
  console.log(item)

  // Obtém a imagem correspondente à espécie
  const imageSource = especiesComuns[item.tipo];

  return (
    <TouchableOpacity onPress={()=> navigation.navigate("DetalheCultura", {CultivoID: item.id})} style={styles.card}>
      <View style={styles.leftContent}>
      <Text style={styles.text}>Nome: {item.nome}</Text>
        <Text style={styles.text}>Area Plantio: {item.area_plantada} tarefas</Text>
        <Text style={styles.text}>Data Plantio: {moment(item.data_plantio).format("DD/MM/YYYY")}</Text>

      </View>
      <View style={styles.rightContent}>
        {imageSource && (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CardCriacoes;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,

    borderColor: palette.primaryGreen,
    borderWidth: 2,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    width: 70,
    height: 70,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});

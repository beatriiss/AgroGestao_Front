import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import palette from "../styles/palette";

const especiesComuns = {
  Gado: require("../assets/especies/Gado.png"),
  Suínos: require("../assets/especies/Suinos.png"),
  Ovelhas: require("../assets/especies/Ovelhas.png"),
  Cabras: require("../assets/especies/Cabras.png"),
  Frangos: require("../assets/especies/Frangos.png"),
  Patos: require("../assets/especies/Patos.png"),
  Cavalos: require("../assets/especies/Cavalos.png"),
};

const CardCriacoes = ({ item }) => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();
  console.log(item)

  // Obtém a imagem correspondente à espécie
  const imageSource = especiesComuns[item.especie];

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
      <Text style={styles.text}>Nome: {item.nome}</Text>
        <Text style={styles.text}>Peso Médio: {item.peso_medio} arrobas</Text>
        <Text style={styles.text}>Número de animais: {item.numero_animais}</Text>
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
    </View>
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

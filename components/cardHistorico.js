import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import palette from "../styles/palette";
import moment from "moment";



const CardHistorico = ({ item }) => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();
  console.log(item)



  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
      <Text style={styles.textT}>{ item.origem ==="history"? "Mudanças na criação":"Aplicação de vacina"}</Text>
      <Text style={styles.text}>Data: {moment(item.data).format("DD/MM/YYYY")}</Text>
       {item.origem === "history" && <>
        <Text style={styles.text}>Peso Médio: {item.peso_medio} arrobas</Text>
        <Text style={styles.text}>Número de animais: {item.numero_animais}</Text></> }
        {item.origem === "vacina" && 
        <Text style={styles.text}>Nome: {item.nome_vacina}</Text>}
      </View>
     
    </View>
  );
};

export default CardHistorico;

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
  textT: {
    fontSize: 18,
    marginVertical: 5,
    fontWeight:'600'
  },
});

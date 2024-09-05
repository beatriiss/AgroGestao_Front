import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useAuth } from "../context/AuthContext";
import palette from "../styles/palette";
import GlobalStyles from "../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Header = ({ screenName }) => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();

  const shouldShowBackButton = !(screenName === "Home" || screenName === "Propriedades" || screenName === "Perfil" || screenName === "Edição de Perfil");

  return (
    <View>
      <StatusBar backgroundColor={palette.primaryGreen} translucent={false} />
      <View style={styles.header}>
        {shouldShowBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons size={32} color={"white"} name="chevron-left" />
          </TouchableOpacity>
        )}
        <Text style={styles.textheader}>
          {screenName == "Home" ? `Olá, ${currentUser?.nome}` : screenName}
        </Text>
        <TouchableOpacity onPress={logout}>
          <MaterialCommunityIcons size={32} color={"white"} name="logout" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: palette.primaryGreen,
    padding: 16,
    justifyContent: "space-between",
  },
  textheader: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});
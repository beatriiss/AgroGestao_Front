import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image
} from "react-native";
import React from "react";
import { useAuth } from "../context/AuthContext";
import palette from "../styles/palette";
import { useNavigation } from '@react-navigation/native';

const Header = ({ screenName }) => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();

  // Determina se o botão "back" deve ser exibido
  const shouldShowBackButton = !(screenName === "Home" || screenName === "Propriedades" || screenName === "Perfil" || screenName === "Edição de Perfil");

  return (
    <View style={styles.headerContainer}>
      <StatusBar backgroundColor={palette.primaryGreen} translucent={false} />
      <View style={styles.header}>
        {shouldShowBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
                          <Image
                source={require("../assets/back.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
                resizeMode="contain"
              />
          </TouchableOpacity>
        )}

        <Text style={styles.textheader}>
          {screenName === "Home" ? `Olá, ${currentUser?.nome}` : screenName}
        </Text>

        {/* Condicional para exibir o ícone de logout ou home */}
        {(screenName === "Home" || screenName === "Perfil" || screenName === "Edição de Perfil") ? (
          <TouchableOpacity onPress={logout}>
             <Image
                source={require("../assets/logout.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
                resizeMode="contain"
              />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Home', {screen:"home"})}>
            <Image
                source={require("../assets/home_w.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
                resizeMode="contain"
              />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 999, // Garante que o Header fique à frente de outros elementos
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  header: {
    flexDirection: "row",
    backgroundColor: palette.primaryGreen,
    padding: 16,
    justifyContent: "space-between",
    alignItems: 'center',
    height: 62,
  },
  textheader: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textTransform: 'capitalize',
  },
});

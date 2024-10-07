// src/navigation/AppNavigator.js
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Image, Keyboard } from "react-native";
import Home from "../screens/restrita/Home";
import Propriedades from "../screens/restrita/Propriedades";
import Perfil from "../screens/restrita/Perfil";
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Cadastro";
import { useAuth } from "../context/AuthContext";
import palette from "../styles/palette";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalPassword } from "./../components/Modal/ModalPassword";
import AdicionarPropriedade from "../screens/restrita/AdicionarPropriedade";
import DetalhePropriedade from './../screens/restrita/DetalhePropriedade';
import AdicionarCriacao from "../screens/restrita/AdicionarCriacao";
import AdicionarCultura from "../screens/restrita/AdicionalCultura";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primaryGreen,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar, // Usando o estilo personalizado para a TabBar
        tabBarStyle: isKeyboardVisible ? { display: "none" } : styles.tabBar, // Oculta a TabBar quando o teclado está ativo
      }}
    >
      <Tab.Screen
        name="Properties"
        component={Propriedades}
        options={{
          tabBarIcon: ({ focused, size }) => (
            focused ? (
              <View style={styles.addButtonContainer}>
                <View style={styles.addButton}>
                  <Image
                    source={require("../assets/icon_white.png")}
                    style={{
                      width: 45,
                      height: 45,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.iconContainer,
                  focused && styles.iconContainerSelected, // Adiciona o estilo quando focado
                ]}
              >
                <Image
                  source={require("../assets/icon_green.png")}
                  style={{
                    width: 45,
                    height: 45,
                  }}
                  resizeMode="contain"
                />
              </View>
            )
          ),
        }}
      />
      {/* Outras telas da tab */}
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <View style={styles.addButtonContainer}>
                <View style={styles.addButton}>
                  <MaterialCommunityIcons name="home" color="#fff" size={30} />
                </View>
              </View>
            ) : (
              <MaterialCommunityIcons
                size={32}
                color={palette.primaryGreen}
                name="home"
              />
            ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <View style={styles.addButtonContainer}>
                <View style={styles.addButton}>
                  <MaterialCommunityIcons
                    name="account"
                    color="#fff"
                    size={30}
                  />
                </View>
              </View>
            ) : (
              <MaterialCommunityIcons
                size={32}
                color={palette.primaryGreen}
                name="account"
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { currentUser } = useAuth();
  console.log("Usuário identificado: ", currentUser);

  return (
    <NavigationContainer>
    <Stack.Navigator  screenOptions={{ headerShown: false }}>
      {currentUser ? (
        <>
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="AdicionarPropriedade"   
        component={AdicionarPropriedade} />
                <Stack.Screen name="DetalhePropriedade"   
        component={DetalhePropriedade} />
        <Stack.Screen name="AdicionarCriacao" component={AdicionarCriacao} />
        <Stack.Screen name="AdicionarCultura" component={AdicionarCultura} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}

    </Stack.Navigator>
  </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    borderRadius: 25,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    overflow: "visible",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: palette.primaryGreen,
    borderRadius: 25,
    width: 62,
    height: 62,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  iconContainerSelected: {
    backgroundColor: "rgba(168, 234, 168, 0.473)", // Verde claro para ícones selecionados
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default AppNavigator;

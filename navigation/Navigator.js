// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from "@expo/vector-icons"

import Home from '../screens/restrita/Home';
import Propriedades from '../screens/restrita/Propriedades';
import Perfil from '../screens/restrita/Perfil';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Cadastro';
import { useAuth } from '../context/AuthContext'
import palette from '../styles/palette';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, tabBarActiveTintColor: palette.primaryGreen }}>
    <Tab.Screen name="Properties" component={Propriedades} 
    options={{
      tabBarIcon: ({ focused, size }) => {
        if (focused) {
          return <Ionicons size={size} color={palette.primaryGreen} name="home" />
        }
        return <Ionicons size={size} color={palette.secondaryGreen} name="home-outline" />
      }
    }}/>


    <Tab.Screen name="Home" component={Home} 
      options={{
        tabBarIcon: ({ focused, size }) => {
          if (focused) {
            return <Ionicons size={size} color={palette.primaryGreen} name="home" />
          }
          return <Ionicons size={size} color={palette.secondaryGreen} name="home-outline" />
        }
      }}/>

      
    <Tab.Screen name="Perfil" component={Perfil} 
      options={{
        tabBarIcon: ({ focused, size }) => {
          if (focused) {
            return <Ionicons size={size} color={palette.primaryGreen} name="person" />
          }
          return <Ionicons size={size} color={palette.secondaryGreen} name="person-outline" />
        }
      }}/>
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { currentUser } = useAuth();

  return (
    <NavigationContainer>
      {currentUser ? (
        <HomeTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

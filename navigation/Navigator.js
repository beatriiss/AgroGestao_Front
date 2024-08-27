// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/restrita/Home';
import Propriedades from '../screens/restrita/Propriedades';
import Informacoes from '../screens/restrita/Informacoes';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Cadastro';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Properties" component={Propriedades} />
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Info" component={Informacoes} />
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

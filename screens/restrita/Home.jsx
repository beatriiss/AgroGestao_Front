// src/components/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Home;

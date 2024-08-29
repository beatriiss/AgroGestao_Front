import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Navigator from "./navigation/Navigator";
import { AlertProvider } from "./context/AlertContext";
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <Navigator />
        <FlashMessage position="top" />
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;

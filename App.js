// App.js
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Navigator from "./navigation/Navigator";
import { AlertProvider } from "./context/AlertContext";

const App = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;

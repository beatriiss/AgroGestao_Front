// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { showFlashMessage } from '../components/Message';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  


  const login = async ({ email, senha }) => {
    try {
      const response = await axios.post(`http://192.168.0.108:3030/users/login`, { email, senha });
      setCurrentUser(response.data.user);
      showFlashMessage('Login realizado com sucesso!', 'success');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          // Exibe mensagem personalizada para o erro 404
          showFlashMessage('Usuário não encontrado', 'danger');
        } else if (error.response.status === 401) {
          // Exibe mensagem personalizada para o erro 401
          showFlashMessage('Senha incorreta', 'danger');
        } else {
          showFlashMessage('Ocorreu um erro. Por favor, tente novamente.', 'danger');
        }
      } else {
      
        showFlashMessage('Erro de rede. Verifique sua conexão.', 'danger');
      }
  
      console.error('Erro ao fazer login:', error);
    }
  };
  
  const register = async (userData) => {
    try {
      const response = await axios.post(`http://192.168.0.108:3030/users/`, userData);
      setCurrentUser(response.data.user);
      showFlashMessage('Cadstro realizado com sucesso!', 'success');
      showFlashMessage('Usuário Autenticado!', 'success');
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      showFlashMessage('Ocorreu um erro. Por favor, tente novamente.', 'danger');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

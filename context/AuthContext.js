// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import { showFlashMessage } from '../components/Message';
import { url } from '../config/url';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Carrega o usuário do AsyncStorage ao iniciar o aplicativo
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const { user, expiration } = JSON.parse(userData);
          const isExpired = new Date().getTime() > expiration;

          if (isExpired) {
            await AsyncStorage.removeItem('currentUser');
          } else {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do AsyncStorage:', error);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async ({ email, senha }) => {
    try {
      const response = await axios.post(`${url}/users/login`, { email, senha });
      const user = response.data.user;

      // Define um tempo de expiração para 7 dias (em milissegundos)
      const expiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

      await AsyncStorage.setItem('currentUser', JSON.stringify({ user, expiration }));

      setCurrentUser(user);
      showFlashMessage('Login realizado com sucesso!', 'success');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${url}/users/`, userData);
      const user = response.data.user;

      // Define um tempo de expiração para 7 dias (em milissegundos)
      const expiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

      await AsyncStorage.setItem('currentUser', JSON.stringify({ user, expiration }));

      setCurrentUser(user);
      showFlashMessage('Cadastro realizado com sucesso!', 'success');
      showFlashMessage('Usuário autenticado!', 'success');
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      showFlashMessage('Ocorreu um erro. Por favor, tente novamente.', 'danger');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Erro ao remover usuário do AsyncStorage:', error);
    }
    setCurrentUser(null);
  };

  const editUser = async (userId, userData) => {
    try {
      const response = await axios.put(`${url}/users/${userId}`, userData);
      const updatedUser = response.data.user;

      // Atualiza o AsyncStorage com o novo usuário e sua nova expiração
      const expiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      await AsyncStorage.setItem('currentUser', JSON.stringify({ user: updatedUser, expiration }));
      console.log("Resposta da atualização que vai pro context: ", updatedUser)
      setCurrentUser(updatedUser);
      showFlashMessage('Usuário atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      showFlashMessage('Erro ao atualizar usuário. Por favor, tente novamente.', 'danger');
    }
  };

  // Função para tratar erros de autenticação
  const handleAuthError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        showFlashMessage('Usuário não encontrado', 'danger');
      } else if (error.response.status === 401) {
        showFlashMessage('Senha incorreta', 'danger');
      } else {
        showFlashMessage('Ocorreu um erro. Por favor, tente novamente.', 'danger');
      }
    } else {
      showFlashMessage('Erro de rede. Verifique sua conexão.', 'danger');
    }

    console.error('Erro ao fazer login:', error);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, editUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import axios from 'axios';
import { url } from '../../config/url';

/**
 * Atualiza um usuário na API.
 *
 * @param {string} userId - O ID do usuário a ser atualizado.
 * @param {object} userData - Os dados do usuário a serem atualizados.
 * @returns {Promise} - Retorna uma Promise que resolve a resposta da API.
 */


export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/${userId}`, userData);
    return response.data; // Retorna os dados da resposta da API
  } catch (error) {
    // Lida com erros e pode retornar uma mensagem ou lançar um erro
    if (error.response) {
      // O servidor respondeu com um status diferente de 2xx
      console.error('Erro de resposta:', error.response.data);
    } else if (error.request) {
      // A solicitação foi feita, mas sem resposta
      console.error('Erro de solicitação:', error.request);
    } else {
      // Erro ao configurar a solicitação
      console.error('Erro ao configurar a solicitação:', error.message);
    }
    throw error; // Re-lança o erro para que possa ser tratado onde a função é chamada
  }
};

import axios from 'axios';
import { url } from '../../config/url';

export const getCultivationDetails = async (id) => {
  try {
    const response = await axios.get(`${url}/cultivation/${id}`);
    return response.data; // Retorna os dados da resposta da API
  } catch (error) {
    // Lida com erros e pode retornar uma mensagem ou lançar um erro
    if (error.response) {
      // O servidor respondeu com um status diferente de 2xx
      console.error('Erro de resposta:', error);
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

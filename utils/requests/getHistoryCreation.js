import axios from 'axios';
import { url } from '../../config/url';
import { buscarVacinas } from './buscarVacinas';

export const getHistoryCreation = async (id) => {
  try {
    // Realiza as requisições para obter histórico e vacinas
    const response_h = await axios.get(`${url}/creations/history/${id}`);
    const response_v = await buscarVacinas(id);

    // Extrai os dados das respostas
    const historyData = response_h.data.history.map(item => ({
      ...item,
      data: new Date(item.data), // Converte a data para objeto Date
      origem: 'history' // Adiciona um campo para identificar a origem como histórico
    }));

    const vacinasData = response_v.map(item => ({
      ...item,
      data: new Date(item.data_vacinacao), // Converte a data_vacinacao para objeto Date
      origem: 'vacina' // Adiciona um campo para identificar a origem como vacina
    }));

    // Combina os dois arrays
    const combinedData = [...historyData, ...vacinasData];

    // Ordena os dados pela data em ordem crescente
    combinedData.sort((a, b) => a.data - b.data);

    console.log(combinedData);

    // Retorna o array ordenado, padronizando a data para string ISO
    return combinedData.map(item => ({
      ...item,
      data: item.data.toISOString() // Converte a data de volta para string ISO
    }));
  } catch (error) {
    // Lida com erros e pode retornar uma mensagem ou lançar um erro
    if (error.response) {
      console.error('Erro de resposta:', error);
    } else if (error.request) {
      console.error('Erro de solicitação:', error.request);
    } else {
      console.error('Erro ao configurar a solicitação:', error.message);
    }
    throw error; // Re-lança o erro para que possa ser tratado onde a função é chamada
  }
};

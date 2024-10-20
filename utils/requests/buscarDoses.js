import axios from "axios";
import { url } from "../../config/url";
export async function buscarDoses(vacinaId) {
    try {
      // Montar a URL com o ID do manejo de higiene
      const response = await axios.post(`${url}/vaccines/doses/${vacinaId}`);
  
      // Obter os dados da resposta
      const data = response.data;
  
      // Retornar os dados para utilização em outro lugar
      return data;
    } catch (error) {
      console.error('Erro ao buscar as agendas de vacinas:', error);
      throw error; // Re-lançar o erro para tratamento onde a função for chamada
    }
  }
  
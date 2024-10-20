import axios from "axios";
import { url } from "../../config/url";
export async function dropVaccine(vaccineId) {
    try {
      // Montar a URL com o ID do manejo de higiene
      const response = await axios.delete(`${url}/vaccines/${vaccineId}`);
  
      return response;
    } catch (error) {
      console.error('Erro ao buscar as agendas de vacinas:', error);
      throw error; // Re-lançar o erro para tratamento onde a função for chamada
    }
  }
  
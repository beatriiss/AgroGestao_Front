import axios from "axios";
import { url } from "../../config/url";
import { showFlashMessage } from "../../components/Message";
export async function dropCultivation(creationId) {
    try {
      // Montar a URL com o ID do manejo de higiene
      const response = await axios.delete(`${url}/cultivations/${creationId}`);
      showFlashMessage("Cultivo deletado.", "danger")
  
      return response;
    } catch (error) {
      console.error('Erro ao buscar as agendas de vacinas:', error);
      throw error; // Re-lançar o erro para tratamento onde a função for chamada
    }
  }
  
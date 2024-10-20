import axios from "axios";
import { url } from "../../config/url";

export async function atualizarStatusDose(doseId, status) {
  try {
    // Montar a URL com o ID da dose
    const response = await axios.put(`${url}/vaccines/doses/${doseId}/status`, {
      status: status,
    });

    // Retornar os dados da resposta, caso precise
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar o status da dose:", error);
    throw error; // Re-lançar o erro para tratamento onde a função for chamada
  }
}

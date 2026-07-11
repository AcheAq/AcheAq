import api from "./api";

/**
 * Serviço de categorias (usado no dropdown do formulário de anúncio).
 *   GET /category -> lista de categorias
 */
const categoryService = {
  getAll: async () => {
    const response = await api.get("/category");
    // O backend pode retornar { data: [...] } (paginado) ou um array direto.
    const data = response.data;
    return Array.isArray(data) ? data : data.items || data.data || [];
  },
};

export default categoryService;

import api from "./api";

/**
 * Serviço de anúncios/itens. Endpoints reais do backend (montados em /item):
 *   POST   /item            (multipart) -> cria anúncio
 *   GET    /item            -> lista (com filtros/paginação)
 *   GET    /item/me         -> anúncios do usuário autenticado
 *   GET    /item/:id        -> detalhe
 *   PATCH  /item/:id        (multipart quando troca foto) -> edita
 *   DELETE /item/:id        -> remove (dono ou admin)
 *   PATCH  /item/:id/resolve -> marca como devolvido ({ returnedAt, returnNote })
 *
 * create/update recebem um FormData (o axios define o boundary do multipart).
 */
const itemService = {
  getAll: async (params = {}) => {
    const response = await api.get("/item", { params });
    return response.data;
  },

  getMine: async (params = {}) => {
    const response = await api.get("/item/me", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/item/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post("/item", formData);
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.patch(`/item/${id}`, formData);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/item/${id}`);
    return response.data;
  },

  resolve: async (id, { returnedAt, returnNote } = {}) => {
    const response = await api.patch(`/item/${id}/resolve`, {
      returnedAt,
      returnNote,
    });
    return response.data;
  },
};

export default itemService;

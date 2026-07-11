import api from "./api";

/**
 * Serviço de usuário. Consome os endpoints existentes no backend:
 *   GET   /user/me  -> dados do usuário autenticado
 *   PATCH /user/me  -> atualiza dados do usuário autenticado
 * O token é injetado automaticamente pelo interceptor em api.js.
 */
const userService = {
  getMe: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },

  updateMe: async (data) => {
    const response = await api.patch("/user/me", data);
    return response.data;
  },
};

export default userService;

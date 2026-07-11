import api from "./api";

const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
  },

  // Solicita o e-mail de recuperação de senha.
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });

    return response.data;
  },

  // Redefine a senha a partir do token recebido por e-mail.
  resetPassword: async ({ token, password }) => {
    const response = await api.post("/auth/reset-password", { token, password });

    return response.data;
  },

  // Altera a senha do usuário autenticado (token via interceptor do api.js).
  changePassword: async ({ currentPassword, newPassword }) => {
    const response = await api.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });

    return response.data;
  },
};

export default authService;
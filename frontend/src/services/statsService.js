import api from "./api";

const statsService = {
  getStats: async () => {
    const response = await api.get("/stats");
    return response.data;
  },

  exportExcel: async () => {
    const response = await api.get("/stats/export", { responseType: "blob" });
    return response.data;
  },
};

export default statsService;

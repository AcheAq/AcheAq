// Normaliza respostas de listagem do backend, que podem vir como um array puro
// ou como um objeto paginado ({ items, total }, { data, total }, etc.).
export function normalizeList(response) {
  if (Array.isArray(response)) {
    return { items: response, total: response.length };
  }

  if (response && typeof response === "object") {
    const items =
      response.items ||
      response.data ||
      response.results ||
      response.rows ||
      [];
    const list = Array.isArray(items) ? items : [];
    const total =
      response.total ??
      response.count ??
      response.totalItems ??
      list.length;
    return { items: list, total };
  }

  return { items: [], total: 0 };
}

export default normalizeList;

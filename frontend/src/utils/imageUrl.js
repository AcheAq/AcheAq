// Monta a URL pública de uma imagem enviada ao backend.
// O backend salva o caminho relativo (ex.: "uploads/123-foto.jpg") em photoUrl
// e serve os arquivos em /uploads. Como o cliente fala com a API via baseURL
// "/api" (proxy em dev, nginx em prod), o caminho final vira "/api/uploads/...".
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function imageUrl(photoUrl) {
  if (!photoUrl) return null;

  // Já é uma URL absoluta (http/https ou data URI): usa como está.
  if (/^(https?:|data:|blob:)/i.test(photoUrl)) return photoUrl;

  // Normaliza barras e remove a inicial para concatenar com a base.
  const normalized = String(photoUrl).replace(/\\/g, "/").replace(/^\/+/, "");

  return `${API_BASE}/${normalized}`;
}

export default imageUrl;

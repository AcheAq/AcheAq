import {
  Backpack,
  BookOpen,
  Smartphone,
  CreditCard,
  Key,
  Package,
  GlassWater
} from "lucide-react";

export function getCategoryFallback(category = "", title = "") {
  const cat = String(category || "").toLowerCase();
  const t = String(title || "").toLowerCase();

  if (
    cat.includes("mochila") ||
    cat.includes("bolsa") ||
    cat.includes("acessório") ||
    cat.includes("acessorio") ||
    t.includes("mochila") ||
    t.includes("bolsa") ||
    t.includes("sacola")
  ) {
    return {
      Icon: Backpack,
      gradient: "linear-gradient(135deg, #ffe5ec 0%, #ffc2d1 100%)",
      color: "#ff4d6d"
    };
  }
  
  if (
    cat.includes("material") ||
    cat.includes("caderno") ||
    cat.includes("livro") ||
    cat.includes("papel") ||
    t.includes("caderno") ||
    t.includes("livro") ||
    t.includes("estojo") ||
    t.includes("caneta")
  ) {
    return {
      Icon: BookOpen,
      gradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
      color: "#0284c7"
    };
  }
  
  if (
    cat.includes("garrafa") ||
    cat.includes("copo") ||
    cat.includes("squeeze") ||
    t.includes("garrafa") ||
    t.includes("copo") ||
    t.includes("caneca")
  ) {
    return {
      Icon: GlassWater,
      gradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      color: "#059669"
    };
  }
  
  if (
    cat.includes("eletrônico") ||
    cat.includes("eletronico") ||
    cat.includes("celular") ||
    cat.includes("fone") ||
    cat.includes("carregador") ||
    t.includes("celular") ||
    t.includes("fone") ||
    t.includes("computador") ||
    t.includes("notebook") ||
    t.includes("carregador") ||
    t.includes("mouse") ||
    t.includes("teclado")
  ) {
    return {
      Icon: Smartphone,
      gradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
      color: "#4f46e5"
    };
  }
  
  if (
    cat.includes("documento") ||
    cat.includes("cartão") ||
    cat.includes("cartao") ||
    cat.includes("carteira") ||
    t.includes("carteira") ||
    t.includes("cartão") ||
    t.includes("documento") ||
    t.includes("rg") ||
    t.includes("cpf") ||
    t.includes("cnh") ||
    t.includes("crachá") ||
    t.includes("cracha")
  ) {
    return {
      Icon: CreditCard,
      gradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      color: "#16a34a"
    };
  }
  
  if (
    cat.includes("chave") ||
    t.includes("chave") ||
    t.includes("chaveiro")
  ) {
    return {
      Icon: Key,
      gradient: "linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)",
      color: "#ca8a04"
    };
  }

  return {
    Icon: Package,
    gradient: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    color: "#475569"
  };
}

export default getCategoryFallback;

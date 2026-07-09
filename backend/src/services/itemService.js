const itemRepository = require("../repositories/itemRepository");
const categoryRepository = require("../repositories/categoryRepository");
const { getPagination } = require("../utils/pagination");
async function createItem(currentUser, data) {
  const category = await categoryRepository.findCategoryById(data.categoryId);

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return await itemRepository.createItem({
    ...data,
    userId: currentUser.id,
  });
}

async function getAllItems(filters) {
  const { page, limit, skip } = getPagination(filters.page, filters.limit);

  return itemRepository.findItemAll({
    ...filters,
    page,
    limit,
    skip,
  });
}

async function getItemById(id) {
  const item = await itemRepository.findItemById(id);

  if (!item) {
    const error = new Error("Objeto não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return item;
}

async function updateItem(currentUser, id, data) {
  const item = await itemRepository.findItemById(id);

  if (!item) {
    const error = new Error("Objeto não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (currentUser.role !== "ADMIN" && item.userId !== currentUser.id) {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  return await itemRepository.updateItem(id, data);
}

async function deleteItem(currentUser, id) {
  const item = await itemRepository.findItemById(id);

  if (!item) {
    const error = new Error("Objeto não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (currentUser.role !== "ADMIN") {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  await itemRepository.deleteItem(id);

  return {
    message: "Objeto deletado com sucesso",
  };
}

async function resolveItem(currentUser, id) {
  const item = await itemRepository.findItemById(id);

  if (!item) {
    const error = new Error("Objeto não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (currentUser.role !== "ADMIN" && item.userId !== currentUser.id) {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  return await itemRepository.updateItem(id, {
    status: "RESOLVED",
  });
}

async function getMyItems(currentUser, query) {
  const pagination = getPagination(query.page, query.limit);

  return await itemRepository.findItemsByUserId(currentUser.id, pagination);
}

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  resolveItem,
  getMyItems,
};

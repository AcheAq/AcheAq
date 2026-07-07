const itemRepository = require("../repositories/itemRepository");
const categoryRepository = require("../repositories/categoryRepository");

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
  return await itemRepository.findItemAll(filters);
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

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  resolveItem,
};

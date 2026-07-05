const categoryRepository = require("../repositories/categoryRepository");

async function createCategory(currentUser, data) {
  if (currentUser.role !== "ADMIN") {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  const existingCategory = await categoryRepository.findCategoryByName(
    data.name,
  );

  if (existingCategory) {
    const error = new Error("Categoria já existe");
    error.statusCode = 409;
    throw error;
  }

  const category = await categoryRepository.createCategory({
    name: data.name,
  });

  return category;
}

async function getAllCategories() {
  return await categoryRepository.findCategoryAll();
}

async function getCategoryById(id) {
  const category = await categoryRepository.findCategoryById(id);

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function updateCategory(currentUser, id, data) {
  if (currentUser.role !== "ADMIN") {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  const category = await categoryRepository.findCategoryById(id);

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  const updatedCategory = await categoryRepository.updateCategory(id, {
    name: data.name,
  });

  return updatedCategory;
}

async function deleteCategory(currentUser, id) {
  if (currentUser.role !== "ADMIN") {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  const category = await categoryRepository.findCategoryById(id);

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await categoryRepository.deleteCategory(id);

  return { message: "Categoria deletada com sucesso" };
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

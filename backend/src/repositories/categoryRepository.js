const prisma = require("../lib/prisma.js");

async function createCategory(data) {
  return await prisma.category.create({
    data,
  });
}

async function findCategoryById(id) {
  return await prisma.category.findUnique({
    where: { id },
  });
}

async function findCategoryByName(name) {
  return await prisma.category.findUnique({
    where: { name },
  });
}

async function findCategoryAll() {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function updateCategory(id, data) {
  return await prisma.category.update({
    where: { id },
    data,
  });
}

async function deleteCategory(id) {
  return await prisma.category.delete({
    where: { id },
  });
}

module.exports = {
  createCategory,
  findCategoryById,
  findCategoryByName,
  findCategoryAll,
  updateCategory,
  deleteCategory,
};

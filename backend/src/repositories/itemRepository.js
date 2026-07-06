const prisma = require("../lib/prisma.js");

async function createItem(data) {
  return prisma.item.create({
    data,
  });
}

async function findItemById(id) {
  return prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function findItemAll() {
  return prisma.item.findMany({
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function updateItem(id, data) {
  return prisma.item.update({
    where: { id },
    data,
  });
}

async function deleteItem(id) {
  return prisma.item.delete({
    where: { id },
  });
}

module.exports = {
  createItem,
  findItemById,
  findItemAll,
  updateItem,
  deleteItem,
};

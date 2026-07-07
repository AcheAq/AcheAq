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

async function findItemAll(filters = {}) {
  const { search, categoryId, status, type, location, order } = filters;

  const where = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  return prisma.item.findMany({
    where,
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
      occurrenceDate: order === "asc" ? "asc" : "desc",
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

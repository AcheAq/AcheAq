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
          phone: true,
          institution: true,
          course: true,
          createdAt: true,
        },
      },
    },
  });
}

async function findItemAll(filters = {}) {
  const {
    search,
    categoryId,
    status,
    type,
    location,
    date,
    sort,
    order,
    page,
    limit,
    skip,
  } = filters;

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

  if (date) {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    where.occurrenceDate = {
      gte: start,
      lte: end,
    };
  }

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            institution: true,
            course: true,
            createdAt: true,
          },
        },
      },
      orderBy:
        sort === "title"
          ? { title: order === "desc" ? "desc" : "asc" }
          : { occurrenceDate: order === "asc" ? "asc" : "desc" },
    }),
    prisma.item.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

async function findItemsByUserId(userId, pagination) {
  const { page, limit, skip } = pagination;

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where: {
        userId,
      },
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            institution: true,
            course: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        occurrenceDate: "desc",
      },
    }),
    prisma.item.count({
      where: {
        userId,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
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
  findItemsByUserId,
};

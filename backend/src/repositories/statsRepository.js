const prisma = require("../lib/prisma.js");

async function countItems(where = {}) {
  return prisma.item.count({ where });
}

async function countUsers() {
  return prisma.user.count();
}

async function countCategories() {
  return prisma.category.count();
}

async function groupItemsByType() {
  return prisma.item.groupBy({
    by: ["type"],
    _count: { _all: true },
  });
}

async function groupItemsByStatus() {
  return prisma.item.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
}

async function groupItemsByCategory() {
  return prisma.item.groupBy({
    by: ["categoryId"],
    _count: { _all: true },
  });
}

async function findCategoriesByIds(ids) {
  return prisma.category.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
}

async function groupItemsByLocation(limit = 5) {
  return prisma.item.groupBy({
    by: ["location"],
    _count: { _all: true },
    orderBy: { _count: { location: "desc" } },
    take: limit,
  });
}

async function itemsByMonth() {
  return prisma.$queryRaw`
    SELECT to_char(date_trunc('month', "occurrenceDate"), 'YYYY-MM') AS month,
           COUNT(*)::int AS total
    FROM "Item"
    GROUP BY 1
    ORDER BY 1;
  `;
}

async function findAllItemsForExport() {
  return prisma.item.findMany({
    include: {
      category: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  countItems,
  countUsers,
  countCategories,
  groupItemsByType,
  groupItemsByStatus,
  groupItemsByCategory,
  findCategoriesByIds,
  groupItemsByLocation,
  itemsByMonth,
  findAllItemsForExport,
};

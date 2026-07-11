const prisma = require("../lib/prisma");

async function createNotification(data) {
  return prisma.notification.create({
    data,
  });
}

async function findByUser(userId) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function findById(id) {
  return prisma.notification.findUnique({
    where: {
      id,
    },
  });
}

async function markAsRead(id) {
  return prisma.notification.update({
    where: {
      id,
    },
    data: {
      read: true,
    },
  });
}

module.exports = {
  createNotification,
  findByUser,
  findById,
  markAsRead,
};

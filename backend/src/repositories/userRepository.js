const prisma = require("../lib/prisma.js");

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function createUser(data) {
  return await prisma.user.create({
    data,
  });
}

async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

async function findUserAll() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}

async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  findUserAll,
  updateUser,
  deleteUser,
};

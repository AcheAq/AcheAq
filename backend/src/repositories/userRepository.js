const prisma = require("../lib/prisma.js");

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  registration: true,
  course: true,
  institution: true,
  role: true,
  createdAt: true,
};

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
    select: userSelect,
  });
}

async function findUserWithPasswordById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, password: true },
  });
}

async function findUserAll() {
  return prisma.user.findMany({
    select: userSelect,
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
    select: userSelect,
  });
}

async function updatePassword(id, password) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password,
    },
  });
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  findUserWithPasswordById,
  findUserAll,
  updateUser,
  deleteUser,
  updatePassword,
};

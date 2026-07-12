const userRepository = require("../repositories/userRepository");
const fs = require("fs");
const path = require("path");

async function getMe(userId) {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    registration: user.registration,
    course: user.course,
    institution: user.institution,
    role: user.role,
    photoUrl: user.photoUrl,
  };
}

async function updateMe(userId, data) {
  const oldUser = await userRepository.findUserById(userId);
  
  if (data.photoUrl && oldUser?.photoUrl) {
    const oldPath = path.join(__dirname, "..", "..", oldUser.photoUrl);
    fs.unlink(oldPath, (err) => { if (err && err.code !== 'ENOENT') console.error("Error deleting old photo:", err); });
  } else if (data.removePhoto === "true" && oldUser?.photoUrl) {
    const oldPath = path.join(__dirname, "..", "..", oldUser.photoUrl);
    fs.unlink(oldPath, (err) => { if (err && err.code !== 'ENOENT') console.error("Error deleting old photo:", err); });
  }

  const updateData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    registration: data.registration,
    course: data.course,
    institution: data.institution,
  };

  if (data.photoUrl) {
    updateData.photoUrl = data.photoUrl;
  } else if (data.removePhoto === "true") {
    updateData.photoUrl = null;
  }

  const user = await userRepository.updateUser(userId, updateData);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    registration: user.registration,
    course: user.course,
    institution: user.institution,
    role: user.role,
    photoUrl: user.photoUrl,
  };
}

async function getAllUsers(currentUser) {
  if (currentUser.role !== "ADMIN") {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  return await userRepository.findUserAll();
}

async function getById(currentUser, id) {
  if (currentUser.role !== "ADMIN") {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  const user = await userRepository.findUserById(id);

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function deleteUser(currentUser, id) {
  if (currentUser.role !== "ADMIN") {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  const user = await userRepository.findUserById(id);

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await userRepository.deleteUser(id);

  return { message: "Usuário deletado com sucesso" };
}

module.exports = {
  getMe,
  updateMe,
  getAllUsers,
  getById,
  deleteUser,
};

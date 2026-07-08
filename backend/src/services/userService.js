const userRepository = require("../repositories/userRepository");

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
  };
}

async function updateMe(userId, data) {
  const user = await userRepository.updateUser(userId, {
    name: data.name,
    email: data.email,
    phone: data.phone,
    registration: data.registration,
    course: data.course,
    institution: data.institution,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    registration: user.registration,
    course: user.course,
    institution: user.institution,
    role: user.role,
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

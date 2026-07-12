const {
  findUserByEmail,
  createUser,
  findUserWithPasswordById,
  updatePassword,
} = require("../repositories/userRepository.js");
const { hashPassword, comparePassword } = require("../utils/hash.js");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt.js");
const prisma = require("../lib/prisma.js");

async function registerUser({
  name,
  email,
  password,
  phone,
  registration,
  course,
  institution,
}) {
  const userExists = await findUserByEmail(email);

  if (userExists) {
    throw new Error("Usuário já existe");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    phone,
    registration,
    course,
    institution,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    registration: user.registration,
    course: user.course,
    institution: user.institution,
  };
}

async function loginUser({ email, password, rememberMe }) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Usuário ou senha inválidos");
  }

  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) {
    throw new Error("Usuário ou senha inválidos");
  }

  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken();
  
  // Se "Lembrar-me", expira em 15 dias. Senão, 1 dia.
  const days = rememberMe ? 15 : 1;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt,
      userId: user.id,
    },
  });

  return {
    token,
    refreshToken,
    expiresAt,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      registration: user.registration,
      course: user.course,
      institution: user.institution,
      role: user.role,
    },
  };
}

async function refreshTokenService(tokenString) {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token: tokenString },
    include: { user: true },
  });

  if (!refreshToken) {
    throw new Error("Refresh Token inválido ou não encontrado");
  }

  if (new Date() > refreshToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
    throw new Error("Refresh Token expirado. Faça login novamente.");
  }

  const newAccessToken = generateAccessToken({
    id: refreshToken.user.id,
    email: refreshToken.user.email,
    role: refreshToken.user.role,
  });

  return { token: newAccessToken };
}

async function logoutUser(tokenString) {
  if (!tokenString) return;
  await prisma.refreshToken.deleteMany({
    where: { token: tokenString },
  });
}

async function logoutAllDevices(userId) {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

async function changePasswordUser(id, currentPassword, newPassword) {
  const user = await findUserWithPasswordById(id);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const passwordMatch = await comparePassword(currentPassword, user.password);

  if (!passwordMatch) {
    throw new Error("Senha atual inválida");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await updatePassword(id, newPasswordHash);
}

module.exports = { 
  registerUser, 
  loginUser, 
  changePasswordUser, 
  refreshTokenService, 
  logoutUser, 
  logoutAllDevices 
};

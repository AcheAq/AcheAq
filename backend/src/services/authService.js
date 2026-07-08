const {
  findUserByEmail,
  createUser,
  findUserWithPasswordById,
  updatePassword,
} = require("../repositories/userRepository.js");
const { hashPassword, comparePassword } = require("../utils/hash.js");
const { generateToken } = require("../utils/jwt.js");

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

async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Usuário ou senha inválidos");
  }

  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) {
    throw new Error("Usuário ou senha inválidos");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
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

module.exports = { registerUser, loginUser, changePasswordUser };

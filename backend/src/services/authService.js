const {
  findUserByEmail,
  createUser,
} = require("../repositories/userRepository.js");
const { hashPassword, comparePassword } = require("../utils/hash.js");
const { generateToken } = require("../utils/jwt.js");

async function registerUser({ name, email, password }) {
  const userExists = await findUserByEmail(email);

  if (userExists) {
    throw new Error("Usuário já existe");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
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
      role: user.role,
    },
  };
}

module.exports = { registerUser, loginUser };

const { registerUser, loginUser } = require("../services/authService.js");
const passwordResetService = require("../services/passwordResetService");

async function register(req, res) {
  try {
    const { name, email, password, phone, registration, course, institution } =
      req.body;

    if (!password || password.length < 6) {
      throw new Error("Senha deve possuir pelo menos 6 caracteres.");
    }

    const user = await registerUser({
      name,
      email,
      password,
      phone,
      registration,
      course,
      institution,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "E-mail é obrigatório.",
      });
    }

    await passwordResetService.requestPasswordReset(email);

    return res.status(200).json({
      message:
        "Se o e-mail estiver cadastrado, você receberá um link de recuperação.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao solicitar recuperação de senha.",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 6) {
      throw new Error("Senha deve possuir pelo menos 6 caracteres.");
    }

    await passwordResetService.resetPassword(token, password);

    return res.status(200).json({
      message: "Senha atualizada com sucesso.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = { register, login, forgotPassword, resetPassword };

const {
  registerUser,
  loginUser,
  changePasswordUser,
  refreshTokenService,
  logoutUser,
  logoutAllDevices,
} = require("../services/authService.js");
const passwordResetService = require("../services/passwordResetService");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../schemas/auth.schema");

async function register(req, res) {
  try {
    const registerValidate = registerSchema.safeParse(req.body);

    if (!registerValidate.success) {
      return res.status(400).json({
        errors: registerValidate.error.flatten().fieldErrors,
      });
    }

    const { name, email, password, phone, registration, course, institution } =
      req.body;

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
    const loginValidate = loginSchema.safeParse(req.body);

    if (!loginValidate.success) {
      return res.status(400).json({
        errors: loginValidate.error.flatten().fieldErrors,
      });
    }

    const { email, password, rememberMe } = req.body;

    const result = await loginUser({ email, password, rememberMe });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: result.expiresAt,
    });

    return res.status(200).json({ token: result.token, user: result.user });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const forgotPasswordValidate = forgotPasswordSchema.safeParse(req.body);

    if (!forgotPasswordValidate.success) {
      return res.status(400).json({
        errors: forgotPasswordValidate.error.flatten().fieldErrors,
      });
    }
    const { email } = req.body;

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
    const resetPasswordValidate = resetPasswordSchema.safeParse(req.body);

    if (!resetPasswordValidate.success) {
      return res.status(400).json({
        errors: resetPasswordValidate.error.flatten().fieldErrors,
      });
    }
    const { token, password } = req.body;

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

async function changePassword(req, res) {
  try {
    const changePasswordValidate = changePasswordSchema.safeParse(req.body);

    if (!changePasswordValidate.success) {
      return res.status(400).json({
        errors: changePasswordValidate.error.flatten().fieldErrors,
      });
    }
    const { currentPassword, newPassword } = req.body;
    const { id: id } = req.user;

    await changePasswordUser(id, currentPassword, newPassword);

    return res.status(200).json({
      message: "Senha alterada com sucesso",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token ausente" });
    }

    const result = await refreshTokenService(refreshToken);

    return res.status(200).json({ token: result.token });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await logoutUser(refreshToken);
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao fazer logout" });
  }
}

async function logoutAll(req, res) {
  try {
    const { id } = req.user;
    await logoutAllDevices(id);
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout de todos os dispositivos realizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao sair de todos os dispositivos" });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  refresh,
  logout,
  logoutAll,
};

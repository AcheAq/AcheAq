const { z } = require("zod");

const passwordValidation = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial");

const registerSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),

  email: z.string().trim().email("E-mail inválido"),

  password: passwordValidation,

  phone: z.string().trim().min(1, "Telefone é obrigatório"),

  registration: z.string().trim().min(1, "Matrícula é obrigatória"),

  course: z.string().trim().min(1, "Curso é obrigatório"),

  institution: z.string().trim().min(1, "Instituição é obrigatória"),
});

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),

  password: z.string().min(6, "Senha Inválida"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token inválido"),
  password: passwordValidation,
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Senha atual inválida"),
  newPassword: passwordValidation,
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};

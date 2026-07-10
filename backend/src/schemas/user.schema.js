const { z } = require("zod");

const updateUserSchema = z
  .object({
    name: z.string().trim().min(2, "Nome inválido").optional(),

    email: z.string().trim().email("E-mail inválido").optional(),

    phone: z.string().trim().min(1, "Telefone inválido").optional(),

    registration: z.string().trim().min(1, "Matrícula inválida").optional(),

    course: z.string().trim().min(1, "Curso inválido").optional(),

    institution: z.string().trim().min(1, "Instituição inválida").optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualização.",
  });

const userIdSchema = z.object({
  id: z.uuid("ID inválido"),
});

module.exports = {
  updateUserSchema,
  userIdSchema,
};

const { z } = require("zod");

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome da categoria deve ter no mínimo 2 caracteres"),
});

const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome da categoria deve ter no mínimo 2 caracteres")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualização.",
  });

const categoryIdSchema = z.object({
  id: z.uuid("ID da categoria inválido"),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
};

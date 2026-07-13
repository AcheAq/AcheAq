const { z } = require("zod");

const createItemSchema = z.object({
  title: z.string().trim().min(3),

  description: z.string().trim().min(10),

  photoUrl: z.string().optional(),

  categoryId: z.uuid("Categoria não encontrada"),

  location: z.string().trim().min(3),

  occurrenceDate: z.coerce.date(),

  type: z.enum(["LOST", "FOUND"]).optional(),

  allowContact: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ).optional(),
});

const updateItemSchema = z
  .object({
    title: z.string().trim().min(3).optional(),

    description: z.string().trim().min(10).optional(),

    categoryId: z.uuid("Categoria inválida").optional(),

    location: z.string().trim().min(3).optional(),

    occurrenceDate: z.coerce.date().optional(),

    type: z.enum(["LOST", "FOUND"]).optional(),

    allowContact: z.preprocess(
      (val) => val === "true" || val === true,
      z.boolean()
    ).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualizar",
  });

const itemIdSchema = z.object({
  id: z.uuid("ID do item inválido"),
});

const itemQuerySchema = z.object({
  categoryId: z.uuid().optional(),

  type: z.enum(["LOST", "FOUND"]).optional(),

  status: z.enum(["OPEN", "RESOLVED"]).optional(),

  search: z.string().trim().optional(),

  date: z.string().optional(),

  sort: z.enum(["occurrenceDate", "title"]).optional(),

  order: z.enum(["asc", "desc"]).optional(),
});

module.exports = {
  createItemSchema,
  updateItemSchema,
  itemIdSchema,
  itemQuerySchema,
};

const categoryService = require("../services/categoryService");
const {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} = require("../schemas/category.schema");

async function create(req, res) {
  try {
    const createCategoryValidate = createCategorySchema.safeParse(req.body);

    if (!createCategoryValidate.success) {
      return res.status(400).json({
        errors: createCategoryValidate.error.flatten().fieldErrors,
      });
    }
    const category = await categoryService.createCategory(req.user, req.body);
    return res.status(201).json(category);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getAll(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(categories);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getById(req, res) {
  try {
    const getCategoryValidate = categoryIdSchema.safeParse(req.params);

    if (!getCategoryValidate.success) {
      return res.status(400).json({
        errors: getCategoryValidate.error.flatten().fieldErrors,
      });
    }
    const category = await categoryService.getCategoryById(req.params.id);
    return res.json(category);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const updateCategoryValidate = updateCategorySchema.safeParse(req.body);

    if (!updateCategoryValidate.success) {
      const errors = updateCategoryValidate.error.flatten();

      return res.status(400).json({
        message: "Dados inválidos",
        errors: {
          ...errors.fieldErrors,
          general: errors.formErrors,
        },
      });
    }
    const category = await categoryService.updateCategory(
      req.user,
      req.params.id,
      req.body,
    );

    return res.json(category);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const removeCategoryValidate = categoryIdSchema.safeParse(req.params);

    if (!removeCategoryValidate.success) {
      return res.status(400).json({
        errors: removeCategoryValidate.error.flatten().fieldErrors,
      });
    }
    const result = await categoryService.deleteCategory(
      req.user,
      req.params.id,
    );

    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};

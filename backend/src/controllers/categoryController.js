const categoryService = require("../services/categoryService");

async function create(req, res) {
  try {
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
    const category = await categoryService.getCategoryById(req.params.id);
    return res.json(category);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
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

const itemService = require("../services/itemService");

async function create(req, res) {
  try {
    const item = await itemService.createItem(req.user, {
      ...req.body,
      photoUrl: req.file?.path,
    });
    return res.status(201).json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getAll(req, res) {
  try {
    const items = await itemService.getAllItems(req.query);
    return res.json(items);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await itemService.getItemById(req.params.id);
    return res.json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const item = await itemService.updateItem(
      req.user,
      req.params.id,
      req.body,
    );
    return res.json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const result = await itemService.deleteItem(req.user, req.params.id);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function resolve(req, res) {
  try {
    const item = await itemService.resolveItem(req.user, req.params.id);
    return res.json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getMyItems(req, res) {
  try {
    const items = await itemService.getMyItems(req.user);
    return res.json(items);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
}
module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  resolve,
  getMyItems,
};

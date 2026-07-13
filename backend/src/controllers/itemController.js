const itemService = require("../services/itemService");
const {
  createItemSchema,
  updateItemSchema,
  itemIdSchema,
  itemQuerySchema,
} = require("../schemas/item.schema");

async function create(req, res) {
  try {
    const createItemValidate = createItemSchema.safeParse({
      ...req.body,
      photoUrl: req.file?.path,
    });

    if (!createItemValidate.success) {
      return res.status(404).json({
        errors: createItemValidate.error.flatten(),
      });
    }
    const item = await itemService.createItem(
      req.user,
      createItemValidate.data,
    );
    return res.status(201).json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getAll(req, res) {
  try {
    const getItemsValidate = itemQuerySchema.safeParse(req.query);

    if (!getItemsValidate.success) {
      return res.status(404).json({
        errors: getItemsValidate.error.flatten(),
      });
    }

    const items = await itemService.getAllItems(req.query);
    return res.json(items);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getById(req, res) {
  try {
    const getItemValidate = itemIdSchema.safeParse(req.params);

    if (!getItemValidate.success) {
      return res.status(400).json({
        errors: getItemValidate.error.flatten().fieldErrors,
      });
    }
    const item = await itemService.getItemById(req.params.id);
    return res.json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const updateItemValidate = updateItemSchema.safeParse(req.body);

    if (!updateItemValidate.success) {
      const errors = updateItemValidate.error.flatten();

      return res.status(400).json({
        message: "Dados inválidos",
        errors: {
          ...errors.fieldErrors,
          general: errors.formErrors,
        },
      });
    }
    const item = await itemService.updateItem(
      req.user,
      req.params.id,
      updateItemValidate.data,
    );
    return res.json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const removeItemValidate = itemIdSchema.safeParse(req.params);

    if (!removeItemValidate.success) {
      return res.status(400).json({
        errors: removeItemValidate.error.flatten().fieldErrors,
      });
    }
    const result = await itemService.deleteItem(req.user, req.params.id);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function resolve(req, res) {
  try {
    const resolveItemValidate = itemIdSchema.safeParse(req.params);

    if (!resolveItemValidate.success) {
      return res.status(400).json({
        errors: resolveItemValidate.error.flatten().fieldErrors,
      });
    }
    const item = await itemService.resolveItem(req.user, req.params.id);
    return res.json(item);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getMyItems(req, res) {
  try {
    const getMyItemsValidate = itemQuerySchema.safeParse(req.query);

    if (!getMyItemsValidate.success) {
      return res.status(404).json({
        errors: getMyItemsValidate.error.flatten(),
      });
    }
    const items = await itemService.getMyItems(req.user, req.query);
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

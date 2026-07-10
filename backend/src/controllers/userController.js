const userService = require("../services/userService");
const { updateUserSchema, userIdSchema } = require("../schemas/user.schema");

async function getMe(req, res) {
  try {
    const user = await userService.getMe(req.user.id);
    return res.json(user);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function updateMe(req, res) {
  try {
    const updateUserValidate = updateUserSchema.safeParse(req.body);

    if (!updateUserValidate.success) {
      const errors = updateUserValidate.error.flatten();

      return res.status(400).json({
        message: "Dados inválidos",
        errors: {
          ...errors.fieldErrors,
          general: errors.formErrors,
        },
      });
    }
    const user = await userService.updateMe(req.user.id, req.body);
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function getAll(req, res) {
  try {
    const users = await userService.getAllUsers(req.user);
    return res.json(users);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getById(req, res) {
  try {
    const getUserValidate = userIdSchema.safeParse(req.params);

    if (!getUserValidate.success) {
      return res.status(400).json({
        errors: getUserValidate.error.flatten().fieldErrors,
      });
    }
    const user = await userService.getById(req.user, req.params.id);
    return res.json(user);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const removeUserValidate = userIdSchema.safeParse(req.params);

    if (!removeUserValidate.success) {
      return res.status(400).json({
        errors: removeUserValidate.error.flatten().fieldErrors,
      });
    }
    const result = await userService.deleteUser(req.user, req.params.id);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  getMe,
  updateMe,
  getAll,
  getById,
  remove,
};

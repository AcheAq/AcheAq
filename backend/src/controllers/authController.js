const { registerUser, loginUser } = require("../services/authService.js");

async function register(req, res) {
  try {
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
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}

module.exports = { register, login };

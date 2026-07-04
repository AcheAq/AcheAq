const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não foi definida.");
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
module.exports = { generateToken, verifyToken };

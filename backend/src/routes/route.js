const express = require("express");

const router = express.Router();

router.get("/api", (req, res) => {
  res.json({ message: "Bem-vindo à API do AcheAq!" });
});

module.exports = router;

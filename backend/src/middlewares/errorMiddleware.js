function errorMiddleware(err, req, res, next) {
  if (err.message === "Apenas imagens são permitidas") {
    return res.status(400).json({
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
}

module.exports = errorMiddleware;

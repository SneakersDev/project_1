// Middleware global de manejo de errores
export const errorHandler = (err, req, res, next) => {
  // Si ya se envió una respuesta, delegamos
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;

  // Estructura consistente de respuesta de error
  const payload = {
    message: err.message || "Internal server error",
  };

  // En desarrollo puedes incluir más detalles
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};



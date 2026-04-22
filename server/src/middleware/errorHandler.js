export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Server error',
    status
  });
}

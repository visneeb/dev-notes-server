const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(statusCode).json({
      status: err.status || "fail",
      message: err.message,
    });
  }

  console.error("UNEXPECTED ERROR", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export default globalErrorHandler;

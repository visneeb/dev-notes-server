import AppError from "./AppError.mjs";

//NotFoundError is a child class of AppError
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    //super() --> use constructor of class AppError
    super(message, 404);
  }
}

export default NotFoundError;

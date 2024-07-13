import { ValidationError } from "express-validation";
import { ApiError } from '../utils/ApiError.js';


export const errorHandler  = (err, req, res, next) => {
  const response = {
    status: err.status || 500,
    message: err.message,
    errors: err.errors || [],
    stack: err.stack,
  };
  res.status(response.status);
  res.json(response);
};

export const errorCoverter = (err, req, res, next) => {
  let convertedError = err;

    if (err instanceof ValidationError) {
       convertedError = new ApiError({
            status: err.statusCode,
            message: err.message,
            errors: err.details,
            stack: err.stack,
        });
    } else if (!(err instanceof ApiError)) {
      convertedError = new ApiError({
            status: err.status,
            message: err.message,
            stack: err.stack,
            reason: err.reason,
        });
    }
    return errorHandler(convertedError, req, res);
  };

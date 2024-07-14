import { ValidationError } from "express-validation";
import { ApiError } from "../utils/ApiError.js";
import chalk from "chalk";

const devError = (err, res) => {
  console.log(
    chalk.blue(
      "-------------------------------------------development Mode-----------------------------------------------"
    )
  );
  res.status(err.status).json({
    status: err.status,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
    data: err.data,
    success: err.success,
  });
};

const prodError = (err, res) => {
  console.log(
    chalk.redBright(
      "-------------------------------------------Production Mode-----------------------------------------------",
      err.isOperational
    )
  );

  if (err.isOperational) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      statu: 500,
      message: "Something went wrong! please try again later",
    });
  }
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    err = new ApiError({
      status: err.statusCode,
      message: err.message,
      errors: err.details,
      stack: err.stack,
    });
  }
  err.status = err.status || 500;
  err.errors = err.errors || [];
  err.stack = err.stack || "";
  err.data = err.data || null;
  err.success = err.success || false;

  if (process.env.NODE_ENV === "development") {
    devError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    prodError(err, res);
  }
};

// export const errorCoverter = (err, req, res, next) => {
//   let convertedError = err;

//   if (err instanceof ValidationError) {
//     convertedError = new ApiError({
//       status: err.statusCode,
//       message: err.message,
//       errors: err.details,
//       stack: err.stack,
//     });
//   } else if (!(err instanceof ApiError)) {
//     convertedError = new ApiError({
//       status: err.status,
//       message: err.message,
//       stack: err.stack,
//       reason: err.reason,
//     });
//   }
//   return errorHandler(convertedError, req, res);
// };

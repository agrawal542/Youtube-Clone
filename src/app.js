import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import { ValidationError } from "express-validation";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

//middle ware allow the data that comes from url,cookie and public
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser())


//******routes import
import userRouter from "./routes/user.routes.js"

//********routes declaration
app.use("/api/v1/users", userRouter) // http://localhost:8000/api/v1/users/register














// app.use(errorCoverter);
app.use(errorHandler);

export { app };
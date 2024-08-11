import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import { ValidationError } from "express-validation";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

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
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import tweetRouter from  "./routes/tweet.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"


//********routes declaration
app.use("/api/v1/users", userRouter) // http://localhost:8000/api/v1/users/register
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)








app.use(notFound);
// app.use(errorCoverter);
app.use(errorHandler);

export { app };
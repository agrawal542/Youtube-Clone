import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
  })
  .catch((err) => {
    console.log("MONGO dB connection failed !!!", err);
  });




















// import mongoose from "mongoose";
// import express from "express";
// import dotenv from "dotenv";
// import { DB_NAME } from "./constants.js";
// const app = express();

// dotenv.config({
//     path: "./.env",
//   });
  
// (async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log(`\n MongoDB connects !! B HOST : ${connectionInstance.connection.host}`)

//         app.on("error", (error) => {
//             console.log("Error", error);
//             throw error
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`App is lisenning on port ${process.env.PORT}`);
//         });
//     }
//     catch (error) {
//         console.error("ERROR:", error);
//         throw error;
//     }
// })();
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log("Error to connect DB");
  });

const app = express();

app.listen(3000, () => {
  console.log("Sever is running on 3000 port");
});

app.use("/api/user",userRouter);

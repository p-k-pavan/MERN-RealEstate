import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.router.js"
import cookieParser from "cookie-parser";
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.MONGODB, {  serverSelectionTimeoutMS: 30000 })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error.message);

    if (error.message.includes('timed out')) {
      console.error('Connection attempt timed out. Please check your database server and network settings.');
    } else {
      console.error('An unexpected error occurred:', error);
    }
  });

const __dirname  = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Sever is running on 3000 port");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing",listingRouter);

app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','dist','index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

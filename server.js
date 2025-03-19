import express from "express";
import "dotenv/config.js";
import dbConnect from "./config/db.js";
import userRouter from "./routers/user.router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import categoryRouter from "./routers/category.router.js";

const app = express();
const port = process.env.PORT || 3000;

//! middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
//! routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);

//! server start
app.listen(port, () => {
  console.log(`server is running on prot http://localhost/${port}`);
  dbConnect();
});

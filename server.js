import express from "express";
import "dotenv/config.js";
import dbConnect from "./config/db.js";
import userRouter from "./routers/user.router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import categoryRouter from "./routers/category.router.js";
import productRouter from "./routers/product.router.js";
import cartRouter from "./routers/cart.router.js";
import addressRouter from "./routers/address.router.js";
import orderRouter from "./routers/order.router.js";

const app = express();
const port = process.env.PORT || 3000;

//! middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
//! routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
//! server start
app.listen(port, () => {
  console.log(`server is running on prot http://localhost/${port}`);
  dbConnect();
});

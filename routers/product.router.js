import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import { createProduct } from "../controller/product.controller.js";
const productRouter = express.Router();

productRouter.post("/create", authUser, createProduct);

export default productRouter;

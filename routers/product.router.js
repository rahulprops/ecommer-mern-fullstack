import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import {
  createProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import upload from "../middleware/multer/multer.js";
const productRouter = express.Router();

productRouter.post("/create", authUser, upload.single("image"), createProduct);
productRouter.delete("/delete/:id", authUser, deleteProduct);
export default productRouter;

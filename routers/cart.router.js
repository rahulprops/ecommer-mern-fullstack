import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import {
  addCartItem,
  removeCartItem,
  updateCart,
} from "../controller/cart.controller.js";
const cartRouter = express.Router();

cartRouter.post("/create/:productId", authUser, addCartItem);
cartRouter.put("/update/:cartItemId", authUser, updateCart);
cartRouter.delete("/remove/:cartItemId", authUser, removeCartItem);

export default cartRouter;

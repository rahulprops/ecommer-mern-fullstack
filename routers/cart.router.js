import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import { addCartItem } from "../controller/cart.controller.js";
const cartRouter = express.Router();

cartRouter.post("/create/:productId", authUser, addCartItem);

export default cartRouter;

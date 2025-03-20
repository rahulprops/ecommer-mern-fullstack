import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import { createOrder } from "../controller/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/create", authUser, createOrder);

export default orderRouter;

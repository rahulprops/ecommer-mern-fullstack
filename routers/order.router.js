import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import {
  confirmOrder,
  createOrder,
  placedOrder,
} from "../controller/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/create", authUser, createOrder);
orderRouter.post("/order-placed/:orderId", placedOrder);
orderRouter.post("/corfirm-order/:orderId", confirmOrder);
export default orderRouter;

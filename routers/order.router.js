import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import {
  confirmOrder,
  createOrder,
  placedOrder,
  shipOrder,
} from "../controller/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/create", authUser, createOrder);
orderRouter.post("/order-placed/:orderId", placedOrder);
orderRouter.post("/corfirm-order/:orderId", confirmOrder);
orderRouter.post("/ship-order/:orderId", shipOrder);
export default orderRouter;

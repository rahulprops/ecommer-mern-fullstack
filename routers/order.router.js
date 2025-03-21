import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import {
  cancelOrder,
  confirmOrder,
  createOrder,
  deliverOrder,
  getAllOrders,
  placedOrder,
  shipOrder,
  userOrderHistory,
} from "../controller/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/create", authUser, createOrder);
orderRouter.post("/order-placed/:orderId", placedOrder);
orderRouter.post("/corfirm-order/:orderId", confirmOrder);
orderRouter.post("/ship-order/:orderId", shipOrder);
orderRouter.post("/deliver-order/:orderId", deliverOrder);
orderRouter.post("/cancel-order/:orderId", cancelOrder);
orderRouter.get("/user-order-history", authUser, userOrderHistory);
orderRouter.get("/all-orders", getAllOrders);
export default orderRouter;

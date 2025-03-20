import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "../controller/address.controller.js";
const addressRouter = express.Router();

addressRouter.post("/create", authUser, createAddress);
addressRouter.put("/update/:addressId", authUser, updateAddress);
addressRouter.delete("/delete/:addressId", authUser, deleteAddress);

export default addressRouter;

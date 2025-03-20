import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import { createAddress } from "../controller/address.controller.js";
const addressRouter = express.Router();

addressRouter.post("/create", authUser, createAddress);

export default addressRouter;

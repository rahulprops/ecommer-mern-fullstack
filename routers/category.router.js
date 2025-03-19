import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import {
  createCategory,
  getAllCategory,
} from "../controller/category.controller.js";
const categoryRouter = express.Router();

categoryRouter.post("/create", authUser, createCategory);
categoryRouter.get("/all", getAllCategory);

export default categoryRouter;

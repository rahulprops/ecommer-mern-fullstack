import express from "express";
import { authUser } from "../middleware/auth/authUser.js";
import { createCategory } from "../controller/category.controller.js";
const categoryRouter = express.Router();

categoryRouter.post("/create", authUser, createCategory);

export default categoryRouter;

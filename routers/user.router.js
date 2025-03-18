import express from "express";
import {
  allUsers,
  createUser,
  findById,
} from "../controller/user.controller.js";
const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.get("/:id", findById);
userRouter.get("/", allUsers);

export default userRouter;

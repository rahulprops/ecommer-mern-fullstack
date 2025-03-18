import express from "express";
import {
  allUsers,
  createUser,
  findById,
  loginUser,
} from "../controller/user.controller.js";
const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/:id", findById);
userRouter.get("/", allUsers);

export default userRouter;

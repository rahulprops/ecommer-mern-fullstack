import express from "express";
import {
  allUsers,
  createUser,
  findById,
  getProfile,
  loginUser,
} from "../controller/user.controller.js";
import { authUser } from "../middleware/auth/authUser.js";
const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.get("/:id", findById);
userRouter.get("/", allUsers);

export default userRouter;

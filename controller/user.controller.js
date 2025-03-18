import validator from "validator";
import bcrypt from "bcrypt";
import { error_logs } from "../middleware/error_log/error_log.js";
import userModel from "../models/user.model.js";
import { generateToken } from "../config/jwt.js";

//! create user
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return error_logs(res, 400, "all feilds requied");
  }
  if (!validator.isEmail(email)) {
    return error_logs(res, 400, "enter valid email");
  }
  try {
    const isUser = await userModel.findOne({ email });

    if (isUser) {
      return error_logs(res, 400, "already user exists");
    }
    // password hash
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new userModel({ name, email, password: hashPassword });
    if (user) {
      await user.save();
      // GENERATE TOKEN
      generateToken(res, user._id);
      return error_logs(res, 201, "create user sucessful");
    } else {
      return error_logs(res, 400, "create user failed");
    }
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};
//! login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return error_logs(res, 400, "all feils requied");
  }
  if (!validator.isEmail(email)) {
    return error_logs(res, 400, "please enter valid email");
  }
  try {
    const isExistUser = await userModel.findOne({ email });
    if (!isExistUser) {
      return error_logs(res, 404, "user not found this email");
    }
    // password check
    const isPasswordCheck = await bcrypt.compare(
      password,
      isExistUser.password
    );
    if (isPasswordCheck) {
      generateToken(res, isExistUser._id);
      return error_logs(res, 200, "user login sucessful");
    } else {
      return error_logs(res, 400, "password worng");
    }
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};
//! find by id
export const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (user) {
      return error_logs(res, 200, "sucess", user);
    } else {
      return error_logs(res, 400, "find user failed");
    }
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};

//! get all users
export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length > 0) {
      return error_logs(res, 200, "sucess", users);
    } else {
      return error_logs(res, 404, "get all users failed");
    }
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};
//! get profile
export const getProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return error_logs(res, 404, "user not found");
    }
    return error_logs(res, 200, "get profile", user);
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};

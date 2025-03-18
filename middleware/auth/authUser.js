import jwt from "jsonwebtoken";
import { error_logs } from "../error_log/error_log.js";
import userModel from "../../models/user.model.js";

export const authUser = async (req, res, next) => {
  try {
    // Extract token from cookies
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
      return error_logs(res, 401, "User not authorized: No token provided");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT);

    // Check if token is valid
    if (!decoded) {
      return error_logs(res, 401, "User not authorized: Invalid token");
    }
    // find user
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return error_logs(res, 404, "token id not found user");
    }
    // Attach the decoded user information to the request object
    req.userId = user._id;

    next();
  } catch (error) {
    // Handle other errors
    return error_logs(
      res,
      500,
      `Server error during authentication ${error.message}`
    );
  }
};

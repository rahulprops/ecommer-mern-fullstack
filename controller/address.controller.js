import { error_logs } from "../middleware/error_log/error_log.js";
import addressModel from "../models/address.model.js";
import userModel from "../models/user.model.js";

//! create address

export const createAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, streetAddress, city, state, zipcode, mobile } =
      req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !streetAddress ||
      !city ||
      !state ||
      !zipcode ||
      !mobile
    ) {
      return error_logs(res, 400, "All fields are required");
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return error_logs(res, 404, "User not found");
    }

    // Create new address
    const newAddress = new addressModel({
      firstName,
      lastName,
      streetAddress,
      city,
      state,
      zipcode,
      mobile,
      user: userId,
    });

    // Save the address
    const savedAddress = await newAddress.save();

    // Push the address ID into the user's addresses array
    user.address.push(savedAddress._id);
    await user.save();

    return error_logs(res, 201, "create address", savedAddress);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

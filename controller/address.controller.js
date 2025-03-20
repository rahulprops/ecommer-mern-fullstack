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

//! update address

export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;
    const { firstName, lastName, streetAddress, city, state, zipcode, mobile } =
      req.body;

    // Find the existing address
    const address = await addressModel.findById(addressId);
    if (!address) {
      return error_logs(res, 404, "Address not found");
    }

    // Ensure that the user owns this address
    if (address.user.toString() !== userId.toString()) {
      return error_logs(
        res,
        403,
        "You are not authorized to update this address"
      );
    }

    // Update only the provided fields
    address.firstName = firstName || address.firstName;
    address.lastName = lastName || address.lastName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipcode = zipcode || address.zipcode;
    address.mobile = mobile || address.mobile;

    // Save the updated address
    await address.save();

    return error_logs(res, 200, "address update sucessful", address);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! delete address

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    // Find the address
    const address = await addressModel.findById(addressId);
    if (!address) {
      return error_logs(res, 404, "Address not found");
    }

    // Ensure the user owns the address
    if (address.user.toString() !== userId.toString()) {
      return error_logs(
        res,
        403,
        "You are not authorized to delete this address"
      );
    }

    // Delete the address
    await addressModel.findByIdAndDelete(addressId);

    // Remove the address from the user's address list
    await userModel.findByIdAndUpdate(userId, {
      $pull: { address: addressId },
    });

    return error_logs(res, 200, "delete address sucessful");
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! all address
export const allAddress = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all addresses for the user
    const addresses = await addressModel.find({ user: userId });

    if (!addresses || addresses.length === 0) {
      return error_logs(res, 404, "No addresses found for this user");
    }

    return error_logs(res, 200, "address get sucessful", addresses);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

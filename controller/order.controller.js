import orderModel from "../models/order.model.js";
import orderItemModel from "../models/orderItem.model.js";
import cartModel from "../models/cart.model.js";
import addressModel from "../models/address.model.js";
import { error_logs } from "../middleware/error_log/error_log.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { shippingAddressId, paymentMethod } = req.body;

    // Fetch the user's cart
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("cartItems");

    if (!cart || cart.cartItems.length === 0) {
      return error_logs(res, 400, "Your cart is empty.");
    }

    // Validate shipping address
    const shippingAddress = await addressModel.findOne({
      _id: shippingAddressId,
      user: userId,
    });
    if (!shippingAddress) {
      return error_logs(res, 404, "Invalid shipping address.");
    }

    // Process cart items into order items
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItems = 0;
    let orderItems = [];

    for (let item of cart.cartItems) {
      const newOrderItem = new orderItemModel({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice,
        userId: userId,
      });

      await newOrderItem.save();
      orderItems.push(newOrderItem._id);

      totalPrice += item.price * item.quantity;
      totalDiscountedPrice += item.discountedPrice * item.quantity;
      totalItems += item.quantity;
    }

    // Calculate discount
    const discount = totalPrice - totalDiscountedPrice;

    // Create order
    const newOrder = new orderModel({
      user: userId,
      orderItems,
      shippingAddress: shippingAddressId,
      totalPrice,
      totalDiscountedPrice,
      discounte: discount,
      totalItem: totalItems,
      paymentDetails: {
        paymentMethod,
        paymentStatus: "PENDING",
      },
    });

    await newOrder.save();

    // Clear user's cart after placing the order
    cart.cartItems = [];
    await cart.save();

    return error_logs(res, 201, "order placed", newOrder);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

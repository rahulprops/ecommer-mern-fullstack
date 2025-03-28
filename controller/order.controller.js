import orderModel from "../models/order.model.js";
import orderItemModel from "../models/orderItem.model.js";
import cartModel from "../models/cart.model.js";
import addressModel from "../models/address.model.js";
import { error_logs } from "../middleware/error_log/error_log.js";
import productModel from "../models/product.model.js";

//! create order

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

//! placedorder

export const placedOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return error_logs(res, 404, "Order not found");
    }

    // Update order status to 'COMPLETE' when placed
    order.orderStatus = "COMPLETE";
    order.deliveryDate = new Date(); // Set delivery date to current date

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};
//! confirt order

export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await orderModel.findById(orderId);
    if (!order) {
      return error_logs(res, 404, "Order not found");
    }

    // Check if the order is already confirmed
    if (order.orderStatus === "CONFIRMED") {
      return error_logs(res, 400, "Order is already confirmed");
    }

    // Update order status to "CONFIRMED"
    order.orderStatus = "CONFIRMED";

    // Optional: If payment is required, check and update payment status
    if (
      order.paymentDetails &&
      order.paymentDetails.paymentStatus === "PENDING"
    ) {
      order.paymentDetails.paymentStatus = "CONFIRMED";
    }

    await order.save();

    return error_logs(res, 200, "order confirmsucessful", order);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! ship order

export const shipOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await orderModel.findById(orderId);
    if (!order) {
      return error_logs(res, 404, "Order not found");
    }

    // Check if the order is already shipped
    if (order.orderStatus === "SHIPPED") {
      return error_logs(res, 400, "Order is already shipped");
    }

    // Ensure the order is confirmed before shipping
    if (order.orderStatus !== "CONFIRMED") {
      return error_logs(res, 400, "Order must be confirmed before shipping");
    }

    // Update order status to "SHIPPED" and set estimated delivery date
    order.orderStatus = "SHIPPED";
    order.deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // Estimated delivery in 5 days

    await order.save();

    return error_logs(res, 200, "order shiped sucessful");
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};
//! deliverOrder

export const deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await orderModel.findById(orderId);
    if (!order) {
      return error_logs(res, 404, "Order not found");
    }

    // Check if the order is already delivered
    if (order.orderStatus === "DELIVERED") {
      return error_logs(res, 400, "Order is already delivered");
    }

    // Ensure the order is shipped before delivering
    if (order.orderStatus !== "SHIPPED") {
      return error_logs(res, 400, "Order must be shipped before delivery");
    }

    // Update order status to "DELIVERED" and set actual delivery date
    order.orderStatus = "DELIVERED";
    order.deliveryDate = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order has been delivered successfully",
      order,
    });
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! cancelorder

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await orderModel.findById(orderId).populate("orderItems");
    if (!order) {
      return error_logs(res, 404, "Order not found");
    }

    // Prevent cancellation if order is already delivered
    if (order.orderStatus === "DELIVERED") {
      return error_logs(res, 400, "Cannot cancel a delivered order");
    }

    // Update stock quantities when an order is canceled
    for (const item of order.orderItems) {
      const product = await productModel.findById(item.product);
      if (product) {
        product.quantity += item.quantity; // Restore stock
        await product.save();
      }
    }

    // Update order status to "CANCELED"
    order.orderStatus = "CANCELED";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order has been canceled successfully",
      order,
    });
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! user order history

export const userOrderHistory = async (req, res) => {
  const userId = req.userId;
  try {
    // Fetch all completed orders for the user
    const orders = await orderModel
      .find({ user: userId, orderStatus: "COMPLETE" })
      .populate({
        path: "orderItems",
        populate: { path: "product" }, // Populate product details inside orderItems
      });

    if (!orders || orders.length === 0) {
      return error_logs(res, 404, "No completed orders found");
    }

    return res.status(200).json({
      success: true,
      message: "User order history retrieved successfully",
      orders,
    });
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! get all order
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate({
      path: "orderItems",
      populate: { path: "product" }, // Populate product details inside orderItems
    });

    if (!orders || orders.length === 0) {
      return error_logs(res, 404, "No orders found");
    }
    return error_logs(res, 200, "all orders", orders);
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};

//! delete order

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order
    const order = await orderModel.findById(id);
    if (!order) {
      return error_logs(res, 404, "Order not found");
    }

    // Ensure only PENDING or CANCELLED orders can be deleted
    if (order.orderStatus !== "PENDING" && order.orderStatus !== "CANCELED") {
      return error_logs(
        res,
        400,
        "Only pending or cancelled orders can be deleted"
      );
    }

    // Delete the order
    await orderModel.findByIdAndDelete(id);

    return error_logs(res, 200, "delete order sucessful");
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

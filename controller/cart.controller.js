import { error_logs } from "../middleware/error_log/error_log.js";
import cartModel from "../models/cart.model.js";
import cartItemModel from "../models/cartItem.model.js";
import productModel from "../models/product.model.js";

export const findUserCart = async (req, res) => {
  const userId = req.userId;
  try {
    const cart = await cartModel.findById({ user: userId });
    let cartItems = await cartItemModel
      .find({ cart: cart._id })
      .populate("product");
    cart.cartItems = cartItems;
    let totalPrice = 0;
    let totalDiscoutedPrice = 0;
    let totalItem = 0;

    for (let cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      totalDiscoutedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    }
    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.discounte = totalPrice - totalDiscoutedPrice;

    await cart.save();
    return error_logs(res, 200, "cart", cart);
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};

//! addtocart
export const addCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId);
    const productId = req.params.productId;
    const { size } = req.body; // Size should come from req.body

    // 🟢 Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return error_logs(res, 404, "Product not found");
    }
    console.log(10);
    // 🟢 Find or create a cart for the user
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({ user: userId, cartItems: [] });
      await cart.save();
    }
    console.log(20);
    // 🟢 Check if item is already in the cart
    let cartItem = await cartItemModel.findOne({
      cart: cart._id,
      product: product._id,
      userId,
    });

    if (cartItem) {
      // Item exists → Increase quantity
      cartItem.quantity += 1;
      await cartItem.save();
      return res.status(200).json({
        success: true,
        message: "Item quantity updated in cart",
        cartItem,
      });
    } else {
      // 🟢 Add new item to cart
      const newCartItem = new cartItemModel({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userId,
        price: product.price,
        size,
        discountedPrice: product.discountedPrice,
      });

      const createdCartItem = await newCartItem.save();
      cart.cartItems.push(createdCartItem);
      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        cartItem: createdCartItem,
      });
    }
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! update cart

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params; // Get cart item ID from URL params
    const { quantity, size } = req.body; // Get updated fields

    // Find the cart item
    let cartItem = await cartItemModel.findOne({
      _id: cartItemId,
      userId,
    });
    if (!cartItem) {
      return error_logs(res, 404, "Cart item not found");
    }

    // Validate product existence
    const product = await productModel.findById(cartItem.product);
    if (!product) {
      return error_logs(res, 404, "Product no longer exists");
    }

    //  Update quantity (ensure it's at least 1)
    if (quantity !== undefined) {
      // Ensure quantity is at least 1
      if (quantity < 1) {
        return error_logs(res, 400, "Quantity must be at least 1");
      }

      // Increment or decrement based on the request type
      if (req.body.action === "increment") {
        cartItem.quantity += 1;
      } else if (req.body.action === "decrement") {
        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
        } else {
          return error_logs(res, 400, "Minimum quantity must be 1");
        }
      } else {
        cartItem.quantity = quantity; // Directly update if action isn't provided
      }
    }

    // Update size if provided
    if (size) {
      cartItem.size = size;
    }

    //  Save updated cart item
    await cartItem.save();

    return error_logs(res, 200, "upate cartItems", cartItem);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! remove cart items

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.userId; // Get the user ID from authentication middleware
    const cartItemId = req.params.cartItemId; // Get cart item ID from request params

    // Find the cart item
    const cartItem = await cartItemModel.findOne({ _id: cartItemId, userId });
    if (!cartItem) {
      return error_logs(res, 404, "Cart item not found");
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return error_logs(res, 404, "Cart not found");
    }

    // Remove the item from the cartItems array
    cart.cartItems = cart.cartItems.filter(
      (item) => item.toString() !== cartItemId
    );

    // Save the updated cart
    await cart.save();

    // Delete the cart item from the database
    await cartItemModel.findByIdAndDelete(cartItemId);

    return error_logs(res, 200, "Item removed from cart");
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

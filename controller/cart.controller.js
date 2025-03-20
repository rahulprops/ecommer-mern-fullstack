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

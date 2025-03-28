import { error_logs } from "../middleware/error_log/error_log.js";
import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import fs from "fs";
//! create product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountedPrice,

      quantity,
      brand,
      sizes,
      category,
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !quantity || !category) {
      return error_logs(res, 400, "All required fields must be provided");
    }

    // Get the uploaded image path
    const image = req.file;
    // console.log(image);
    if (!image) {
      return error_logs(res, 400, "please select image");
    }

    // Convert sizes string to an array (if sent as JSON string)
    const parsedSizes = sizes ? JSON.parse(sizes) : [];

    // check category
    const isCategory = await categoryModel.findOne({ name: category });
    if (!isCategory) {
      return error_logs(res, 404, "not found cateogry");
    }

    // Create new product
    const newProduct = new productModel({
      title,
      description,
      price,
      discountedPrice,

      quantity,
      brand,
      sizes: parsedSizes,
      image: image.path,
      category: isCategory._id,
    });

    // Save product to database
    await newProduct.save();

    return error_logs(res, 201, "product create sucessful", newProduct);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletePro = await productModel.findByIdAndDelete(id, { new: true });
    if (deletePro) {
      return error_logs(res, 200, "delete product done");
    } else {
      return error_logs(res, 400, "delete product failed");
    }
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};

//! update product

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      discountedPrice,
      quantity,
      brand,
      sizes,
      category,
    } = req.body;

    // Find the existing product
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return error_logs(res, 404, "Product not found");
    }

    // Handle image update
    let imagePath = existingProduct.image;

    if (req.file) {
      const oldImagePath = existingProduct.image;
      if (req.file.path == existingProduct.image) {
        imagePath = existingProduct.image;
      } else {
        // Check if the old image exists before deleting
        if (oldImagePath && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        imagePath = req.file.path; // Update with new image path
      }
    }

    // Convert sizes string to an array (if sent as JSON string)
    let parsedSizes = existingProduct.sizes;
    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch (error) {
        return error_logs(
          res,
          400,
          "Invalid sizes format. Expected JSON array."
        );
      }
    }

    // Check if category exists
    if (category) {
      const isCategory = await categoryModel.findOne({ name: category });
      if (!isCategory) {
        return error_logs(res, 404, "Category not found");
      }
      existingProduct.category = isCategory._id;
    }

    // Update product fields
    existingProduct.title = title || existingProduct.title;
    existingProduct.description = description || existingProduct.description;
    existingProduct.price = price || existingProduct.price;
    existingProduct.discountedPrice =
      discountedPrice || existingProduct.discountedPrice;
    existingProduct.quantity = quantity || existingProduct.quantity;
    existingProduct.brand = brand || existingProduct.brand;
    existingProduct.sizes = parsedSizes || existingProduct.sizes;
    existingProduct.image = imagePath;

    // Save updated product
    await existingProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

//! get all product

export const getAllProduct = async (req, res) => {
  try {
    const { category, color, sizes, minPrice, maxPrice, minDiscount, stock } =
      req.query;

    let filter = {}; // Dynamic filter object

    // 🟢 Category Filter
    if (category) {
      const isCategory = await categoryModel.findOne({ name: category });
      if (isCategory) {
        filter.category = isCategory._id;
      } else {
        return error_logs(res, 404, "Category not found");
      }
    }

    // 🟢 Price Range Filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice); // Minimum price
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice); // Maximum price
    }

    // 🟢 Discount Filter
    if (minDiscount) {
      filter.discountedPrice = { $gte: parseFloat(minDiscount) };
    }

    // 🟢 Stock Filter (Only products in stock)
    if (stock === "true") {
      filter.quantity = { $gt: 0 }; // Only products with stock greater than 0
    }

    // 🟢 Sizes Filter (Checking if the size exists in the product's sizes array)
    if (sizes) {
      filter["sizes.name"] = { $in: sizes.split(",") };
    }

    // 🟢 Color Filter (Assuming color is stored in a 'color' field)
    if (color) {
      filter.color = color;
    }

    // Fetch products with filtering and populate category details
    const products = await productModel.find(filter).populate("category");

    if (!products.length) {
      return error_logs(res, 404, "No products found with the given criteria");
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};
//! findProductbyid
export const findProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id);
    if (product) {
      return error_logs(res, 200, "get product", product);
    } else {
      return error_logs(res, 400, "failed product ");
    }
  } catch (err) {
    return error_logs(res, 500, `server error ${err.message}`);
  }
};

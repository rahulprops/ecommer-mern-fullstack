import { error_logs } from "../middleware/error_log/error_log.js";
import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
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

import { error_logs } from "../middleware/error_log/error_log.js";
import categoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return error_logs(res, 400, "Category name is required");
    }

    // Check if the category already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return error_logs(res, 400, "Category already exists");
    }

    // Create new category
    const newCategory = new categoryModel({ name });
    await newCategory.save();

    return error_logs(res, 201, "create category ", newCategory);
  } catch (err) {
    return error_logs(res, 500, `Server error: ${err.message}`);
  }
};

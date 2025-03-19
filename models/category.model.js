import mongoose, { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
  },
  { timestamps: true }
);
const categoryModel = model("categories", categorySchema);
export default categoryModel;

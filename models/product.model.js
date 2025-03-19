import mongoose, { model, Schema } from "mongoose";
import { type } from "os";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
    discountPersent: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
    },
    sizes: [
      {
        name: { type: String },
        quntity: { type: Number },
      },
    ],
    image: String,
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rating",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
    numRatings: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
  },
  { timestamps: true }
);
const productModel = model("product", productSchema);
export default productModel;

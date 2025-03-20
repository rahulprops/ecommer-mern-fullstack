import mongoose, { model, Schema } from "mongoose";

const addressSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipcode: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    mobile: {
      type: String,
      required: true,
    },
  },
  { timeseries: true }
);
const addressModel = model("addresses", addressSchema);
export default addressModel;

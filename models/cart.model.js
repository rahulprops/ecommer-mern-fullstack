import mongoose, { model, Schema } from "mongoose";

const cartSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    cartItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cartItem",
        required:true,
    }],
    totalPrice:{
        type:Number,
        required:true,
        default:0,
    },
    totalItem:{
        type:Number,
        required:true,
        default:0,
    },
    totalDiscoutedPrice:{
        type:Number,
        required:true,
        default:0,
    },
    discounte:{
        type:Number,
        required:true,
        default:0,
    }
},{timeseries:true})
const cartModel=model("cart",cartSchema)
export default cartModel;
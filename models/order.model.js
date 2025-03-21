import mongoose, { model, Schema } from "mongoose";
import { type } from "os";

const orderSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"orderItem",
    }],
    orderDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    deliveryDate:{
        type:Date,
    },
    shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"addresses",
    },
    paymentDetails:{
         paymentMethod:{
            type:String,
         },
         transactionId:{
            type:String,
         },
         paymentId:{
            type:String,
         },
         paymentStatus:{
            type:String,
            default:"PENDING",
         }
    },
  totalPrice:{
    type:Number,
    required:true,
  },
  totalDiscountedPrice:{
    type:Number,
    required:true
  },
  discounte:{
    type:Number,
    required:true,
  },
  orderStatus:{
    type:String,
    required:true,
    default:"PENDING"
  },
  totalItem:{
    type:Number,
    required:true,
  },
},{timestamps:true})
const orderModel=model("order",orderSchema)
export default orderModel;
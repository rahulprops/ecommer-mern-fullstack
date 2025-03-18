import mongoose, { model, Schema } from "mongoose";

const orderItemsSchema= new Schema({
   product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"product",
    required:true,
   },
   size:{
    type:String,
   },
   quantity:{
    type:Number,
    required:true,
   },
   price:{
    type:Number,
    required:true,
   },
   discountedPrice:{
    type:Number,
    required:true,
   },
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
   },
   
},{timestamps:true})
const orderItemModel=model("orderItem",orderItemsSchema)
export default orderItemModel;
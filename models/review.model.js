import mongoose, { model, Schema } from "mongoose";

const reviewSchema=new Schema({
    review:{
        type:String,
        required:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }
},{timestamps:true})
const reviewModel=model("review",reviewSchema)
export default reviewModel;
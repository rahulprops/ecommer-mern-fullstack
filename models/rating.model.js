import mongoose, { model, Schema } from "mongoose";

const ratingSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
},{timestamps:true})
const ratingModel=model("rating",ratingSchema)
export default ratingModel;
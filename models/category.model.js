import mongoose, { model, Schema } from "mongoose";

const categorySchema=new Schema({
    name:{
        type:String,
        required:true,
        maxlength:50,
    },
    parentCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
    },
    level:{
        type:Number,
        required:true,
    }
},{timestamps:true})
const categoryModel=model("categories",categorySchema)
export default categoryModel;
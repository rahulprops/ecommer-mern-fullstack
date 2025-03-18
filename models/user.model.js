import mongoose, { model, Schema } from "mongoose";
import { type } from "os";

const userSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        required:true,
        enum:["CUSTOMER","ADMIN"],
        default:"CUSTOMER"
    },
    mobial:String,
    address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"addresses"
    }],
    paymentInfo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"payment_information"
    }],
    ratings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ratings"
    }],
    revies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"reviews"
    }],
},{timeseries})
const userModel=model("user",userSchema)
export default userModel;
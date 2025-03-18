import validator from 'validator'
import bcrypt from 'bcrypt'
import { error_logs } from '../middleware/error_log/error_log.js'
import userModel from '../models/user.model.js'
export const createUser=async (req,res)=>{
    const {name,email,password}=req.body
    if(!name || !email || !password){
        return error_logs(res,400,"all feilds requied")
    } 
    if(!validator.isEmail(email)){
        return error_logs(res,400,"enter valid email") 
    }
    try {
        const isUser=await userModel.findOne({email})
        
        if(isUser){
            return error_logs(res,400,"already user exists")
        }
        // password hash
        const hashPassword=await bcrypt.hash(password,12)
        const user=new userModel({name,email,password:hashPassword})
        if(user){
            await user.save()
            return error_logs(res,201,"create user sucessful")
        }else{
            return error_logs(res,400,"create user failed")
        }
    } catch (err) {
    return error_logs(res,500,`server error ${err.message}`)
    }
}
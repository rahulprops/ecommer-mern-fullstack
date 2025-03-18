import mongoose from "mongoose";

const dbConnect= async()=>{
  try {
        const db = mongoose.connect(process.env.DB)
        if(db){
            console.log('database connect sucessful')
        }else{
            console.log('database connect failed')
        }
  } catch (error) {
    throw new Error(error)
  }
}
export default dbConnect;
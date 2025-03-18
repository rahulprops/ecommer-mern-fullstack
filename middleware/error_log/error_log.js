
export const error_logs=(res,status,message,data)=>{
    res.status(status).json({message,data}) 
}
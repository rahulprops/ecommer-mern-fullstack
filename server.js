import express from 'express'
import 'dotenv/config.js'
import dbConnect from './config/db.js'
import userRouter from './routers/user.router.js'
import bodyParser from 'body-parser'

const app=express()
const port = process.env.PORT || 3000

//! middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
//! routes
app.use("/api/user",userRouter)

//! server start
app.listen(port,()=>{
    console.log(`server is running on prot http://localhost/${port}`)
    dbConnect()
})
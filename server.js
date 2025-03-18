import express from 'express'
import 'dotenv/config.js'

const app=express()
const port = process.env.PORT || 3000

//! server start
app.listen(port,()=>{
    console.log(`server is running on prot http://localhost/${port}`)
})
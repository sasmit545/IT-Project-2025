import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express"
const app=express()
const connection = async ()=>{
    try {
        console.log(`${process.env.MONGODB}/${DB_NAME}`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error in connecting")
            throw error
        })
        console.log("Connected to mongodb ",`${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.error("error hogya bhai :",error)
        throw error
    }
}

export default connection
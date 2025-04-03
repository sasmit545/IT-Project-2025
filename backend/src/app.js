import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
const app=express()
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        
        credentials:true
    }
))

app.use(express.json());

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public")) 

app.use(cookieParser())

import UserRoute from "./routes/user.routes.js"

app.use("/api/v1/user",UserRoute)


export default app;

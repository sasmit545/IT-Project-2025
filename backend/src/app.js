import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
import { upload } from "./middleware/multer.middleware.js";
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
import  userroute from "./routes/user.routes.js";

app.use("/v1/user",userroute);

export default app;

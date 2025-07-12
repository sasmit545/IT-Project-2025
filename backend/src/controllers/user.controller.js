import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import {ApiResponse} from "../utils/ApiResponse.utils.js"
import { uploadCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.utils.js"
import asyncHandler from "../utils/AsyncHandler.utils.js"
import mongoose from "mongoose"
import {passwordForgotHelper} from "../utils/email.utils.js"
import { client, client as redisclient } from "../db/redisConnect.js"
import crypto from "crypto"
const createUser = asyncHandler(async (req, res) => {
    
        try {
            console.log("Create user request received")
            const {username, password, email} = req.body
            if (username.trim() === "" || password.trim() === "" || email.trim() === "") {
                throw new ApiError(400, "Please provide all required fields")
            }
             const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
            if (existingUser) {
                throw new ApiError(400, "Username or email already exists");
            }
            let user = await new User({username, password, email})
            user = await user.save()
            
            if (!user) {
                throw new ApiError(500, "Unable to create user")
            }
    
            user=user.toObject()
            delete user.password
            delete user.refreshToken
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user
            })
        } catch (error) {
            if (error.statusCode === undefined) {
                error.statusCode = 500
            }
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: error.data,
                errorcode: error.statusCode,
                errors: error.errors
            })
            
        }

    
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        console.log("Login request received")
        const {username, password} = req.body
        if (!username || !password) {
            throw new ApiError(400, "Please provide all required fields")
        }
        const user=await User.findOne({username})
        if (!user) {
            throw new ApiError(401, "Invalid username or password")
        }
        const isPassCorrect = await user.isPasscorrect(password)
        if (!isPassCorrect) {
            throw new ApiError(401, "Invalid username or password")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save()
        const option= {
            httpOnly:true,
            secure:true
           
        }
        return res.status(200).cookie("refreshToken", refreshToken, option).
        cookie("accessToken", accessToken, option).
        json(
            new ApiResponse(200, "Login successful", 
                {accessToken,
                refreshToken
                },     
            )
        )
    } catch (error) {
        if (error.statusCode === undefined) {
            error.statusCode = 500
        }
        
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            data: error.data,
            errorcode: error.statusCode,
            errors: error.errors
        })
        
    }
})

 const logoutUser = asyncHandler(async (req, res) => {
    try {
        console.log("Logout request received")
        const username = req.user.username
        const user = await User.findOne({username})
        if (!user) {
            throw new ApiError(401, "User not found")
        }
        user.refreshToken = null
        await user.save()
        res.status(200).clearCookie("refreshToken").
        clearCookie("accessToken").
        json(
            new ApiResponse(200, "Logout successful",
                {message: "Logout successful"}
            )
        )
        
    } catch (error) {
        if (error.statusCode === undefined) {
            error.statusCode = 500
        }
        return res.status(error.statusCode).json(
            new ApiError(500, "Unable to logout user",error)
        )
    }
});

const sendEmailForgotPassword = asyncHandler (async (req,res)=>
{
    
    try {
        const {email}= req.body;
        if(email===null)
        {
            return res.status(400).json(
                new ApiError(400,"","Email is required for account recovery")
            );
        }
        const accountdetail = await User.findOne({email})
        if(accountdetail===null)
        {
            return res.status(400).json(
                new ApiError(400,"","Email is required for account recovery")
            );
        }
        const token = crypto.randomBytes(32).toString("hex");
        await redisclient.set(token,accountdetail.username,{
            NX:true,
            EX:3600
        })
        await passwordForgotHelper(email,token,accountdetail.username);
        return res.status(200).json(
            new ApiResponse(200,"","Check Email For More Instruction")
        )       

        
    } catch (error) {
        console.error("Error in sending forgot password email:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
})

const resetPassword = asyncHandler ( async (req,res)=>
{
    try {
        const {token,name,newpassword}=req.body;
        if (token==="" || name ==="")
        {
            return res.status(400).json(
                new ApiError(400,"","token and name is required for account recovery")
            );
        }
        const userId = await client.get(token);
        console.log("User ID from Redis:", userId);
        if (userId===null)
        {
            return res.status(402).json(
                new ApiError(402,"","Invalid or expired token")
            ); 
        }
        if (userId!==name)
        {
            return res.status(403).json(
                new ApiError(403,"","Invalid token for this user")
            );
        }
        let user = await User.findOne({ username: name });
        

        if (!user) {
            return res.status(404).json(
                new ApiError(404,"","User not found")
            );
        }
        user.password = newpassword;
        await user.save();
        await client.del(token);
        console.log("Password reset successful for user:", name);
        return res.status(200).json(
            new ApiResponse(200,"","Password reset successful")
        );
        
    } catch (error) {
        console.error("Error in resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
})




export {loginUser, createUser,logoutUser,sendEmailForgotPassword,resetPassword}
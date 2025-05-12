import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import {ApiResponse} from "../utils/ApiResponse.utils.js"
import { uploadCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.utils.js"
import asyncHandler from "../utils/AsyncHandler.utils.js"


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


export {loginUser, createUser,logoutUser}


    


import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import {ApiResponse} from "../utils/ApiResponse.utils.js"
import { uploadCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.utils.js"
import asyncHandler from "../utils/AsyncHandler.utils.js"


const createUser = asyncHandler(async (req, res) => {
    try {
        const {username, password, email} = req.body
        if (username.trim() === "" || password.trim() === "" || email.trim() === "") {
            throw new ApiError(400, "Please provide all required fields")
        }
         const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            throw new ApiError(400, "Username or email already exists");
        }
        let user = await new User({username, password, email})
        
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
        throw new ApiError(500, "Unable to create user", error)
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        throw new ApiError(400, "Please provide all required fields")
    }
    const user=User.findOne({username})
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
    return res.status(200).setCookie("refreshToken", refreshToken, option).
    setCookie("accessToken", accessToken, option).
    json(
        new ApiResponse(200, "Login successful", 
            {accessToken,
            refreshToken
            },     
        )
    )
})


export {loginUser, createUser}


    


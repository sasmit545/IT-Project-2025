import {ApiError} from "../utils/ApiError.utils.js";
import {ApiResponse} from "../utils/ApiResponse.utils.js";
import {User} from "../models/User.model.js";
import asyncHandler from "express-async-handler";   
import e from "express";


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log({ username, email, password });
    if (!username || !email || !password) {
        throw new ApiError(400, "Please provide all details");
    }
    const doesUserExist = await User.findOne({email});
    if (doesUserExist) {
        throw new ApiError(400, "User already exists");
    }
    let user = await User.create({ username, email, password });

    if (!user) {
        throw new ApiError(500, "User registration failed");
    }
    user = user.toObject();
    delete user.password


    return res.status(201).json(
        new ApiResponse(201,user,"User registered successfully")
        );

});  


export {registerUser}
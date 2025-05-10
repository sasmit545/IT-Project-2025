import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import {ApiResponse} from "../utils/ApiResponse.utils.js"
import { uploadCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.utils.js"
import asyncHandler from "../utils/AsyncHandler.utils.js"
import Website from "../models/website.model.js"

const openwebsitebyid  = asyncHandler(async (req, res) => {
    try {
        console.log("Open website by id request received")
        const {websiteid} = req.params
        if (!websiteid) {
            throw new ApiError(400, "Please provide all required fields")
        }
        const website=await Website.findById(websiteid).populate('owner')
        if (!website) {
            throw new ApiError(404, "Website not found")
        }
        return res.status(200).json({
            success: true,
            message: "Website opened successfully",
            data: website
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
});

const listAllWebsitesByUserId = asyncHandler(async (req, res) => {
    try {
        console.log("List all websites by user id request received")
        const {userid} = req.params
        if (!userid) {
            throw new ApiError(400, "Please provide all required fields")
        }
        const websites=await Website.find({owner:userid}).populate('owner')
        if (!websites) {
            throw new ApiError(404, "Websites not found")
        }
        return res.status(200).json({
            success: true,
            message: "Websites listed successfully",
            data: websites
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
});

const createWebsite = asyncHandler(async (req, res) => {
    try {
        console.log("Create website request received")
        const {sourcecode, name} = req.body
        if (!sourcecode || !name) {
            throw new ApiError(400, "Please provide all required fields")
        }
        const website=await Website.create({
            sourcecode,
            name,
            owner:req.user._id
        })
        return res.status(200).json({
            success: true,
            message: "Website created successfully",
            data: website
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
});

const updateWebsite = asyncHandler(async (req, res) => {
    try {
        console.log("Update website request received")
        const {websiteid} = req.params
        const {sourcecode, name} = req.body
        if (!websiteid || !sourcecode || !name) {
            throw new ApiError(400, "Please provide all required fields")
        }
        const website=await Website.findByIdAndUpdate(websiteid, {
            sourcecode,
            name
        }, {new: true})
        if (!website) {
            throw new ApiError(404, "Website not found")
        }
        return res.status(200).json({
            success: true,
            message: "Website updated successfully",
            data: website
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
});

export {
    openwebsitebyid,
    listAllWebsitesByUserId,
    createWebsite,
    updateWebsite
}
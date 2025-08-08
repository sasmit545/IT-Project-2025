import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { uploadCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.utils.js"
import asyncHandler from "../utils/AsyncHandler.utils.js"
import Website from "../models/website.model.js"
import {
    SavePage,
    GetPage
} from "../utils/Cache.utils.js"
import { client } from "../db/redisConnect.js"
import mongoose from "mongoose"

const openwebsitebyid = asyncHandler(async (req, res) => {
    try {
        console.log("Open website by id request received")

        let { websiteid } = req.params
        websiteid = websiteid.replace(/:/g, "")
        if (!mongoose.isValidObjectId(websiteid)) {
            throw new ApiError(400, "Invalid website id")
        }
        if (!websiteid) {
            throw new ApiError(400, "Please provide all required fields")
        }
        
        // Try to get website from cache first
        let website;
        let fromCache = false;
        try {
            const cachedResult = await GetPage(websiteid);
            if (cachedResult.success && cachedResult.fromCache) {
                // Construct website object from cached data
                website = {
                    _id: websiteid,
                    sourcecode: cachedResult.sourceCode,
                    // We still need to get other details from database
                };
                fromCache = true;
                console.log("Website source code retrieved from cache");
            }
        } catch (cacheError) {
            console.log("Cache miss or error, fetching from database:", cacheError.message);
        }

        // If not in cache or need full details, fetch from database
        if (!fromCache) {
            website = await Website.findById(websiteid).populate('owner');
        } else {
            // Get full website details from database but we have cached sourcecode
            const fullWebsite = await Website.findById(websiteid).populate('owner');
            if (fullWebsite) {
                website = {
                    ...fullWebsite.toObject(),
                    sourcecode: website.sourcecode // Use cached sourcecode
                };
            } else {
                website = null;
            }
        }

        if (!website) {
            throw new ApiError(404, "Website not found")
        }
        // console.log("Website found:", website)

        const isPublic = website.accessType === true
        const isOwner = req.user?._id && website.owner.toString() === req.user._id.toString()

        if (!isPublic && !isOwner) {
            console.log("User is not authorized to open this website")
            throw new ApiError(403, "You are not authorized to open this website")
        }

        console.log("Website opened successfully")
        const plainWebsite = website.toObject();
        
        const {_id,createdAt,owner,name,updatedAt,...sanitizedDocs}= plainWebsite
        console.log(sanitizedDocs)
        return res.status(200).json({
            success: true,
            message: "Website opened successfully",
            data: sanitizedDocs
        })
    }
    catch (error) {
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

        const userid = req.user._id
        if (!userid) {
            throw new ApiError(400, "Please provide all required fields")
        }

        // Check cache first for latest websites
        const cacheKey = `user_latest_websites:${userid}`;
        const cachedWebsites = await client.get(cacheKey);
        
        if (cachedWebsites) {
            console.log("Returning cached latest websites");
            return res.status(200).json({
                success: true,
                message: "Websites listed successfully (from cache)",
                data: JSON.parse(cachedWebsites)
            });
        }

        let websites = await Website.find({ owner: userid }).populate('owner').sort({ updatedAt: -1 })
        if (!websites) {
            throw new ApiError(404, "Websites not found")
        }
        
        // Cache individual websites using SavePage utility
        const latestWebsites = websites.slice(0, Math.min(5, websites.length));
        for (const website of latestWebsites) {
            try {
                await SavePage(website._id);
            } catch (cacheError) {
                console.error(`Failed to cache website ${website._id}:`, cacheError.message);
            }
        }

        const sanitizedDocs = websites.map(doc => {
            const obj = doc.toObject();
            const { owner, sourcecode, createdAt, ...rest } = obj;
            return rest;
        });

        // Cache the latest min(5, number of websites)
        const latestWebsites_sanitized = sanitizedDocs.slice(0, Math.min(5, sanitizedDocs.length));
        await client.setEx(cacheKey, 1800, JSON.stringify(latestWebsites_sanitized)); // Cache for 30 minutes

        return res.status(200).json({
            success: true,
            message: "Websites listed successfully",
            data: sanitizedDocs
        })
    }
    catch (error) {
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
        const { sourcecode, name, isPrivate } = req.body
        if (!sourcecode || !name) {
            throw new ApiError(400, "Please provide all required fields")
        }

        // console.log(isPrivate, typeof(isPrivate))
        const website = await Website.create({
            sourcecode,
            name,
            owner: req.user._id,
            accessType: isPrivate !== "true"
        })

        return res.status(200).json({
            success: true,
            message: "Website created successfully",
            data: website
        })
    }
    catch (error) {
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
        let { websiteid } = req.params
        websiteid = websiteid.replace(/:/g, "")

        const { sourcecode, name } = req.body

        if (!websiteid || !sourcecode || !name) {
            throw new ApiError(400, "Please provide all required fields")
        }

        const website = await Website.findById(websiteid)

        if (!website) {
            throw new ApiError(404, "Website not found")
        }

        const isOwner = req.user?._id && website.owner.toString() === req.user._id.toString()

        if (!isOwner) {
            throw new ApiError(403, "You are not authorized to update this website")
        }

        website.sourcecode = sourcecode
        website.name = name
        await website.save()

        return res.status(200).json({
            success: true,
            message: "Website updated successfully",
            data: website
        })
    }
    catch (error) {
        if (error.statusCode === undefined) {
            error.statusCode = 500
        }
        if (error.statusCode === 403) {
            return res.status(error.statusCode).json({
                success: false,
                message: "You are not authorized to update this website",
                errorcode: error.statusCode
            })
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
import { client, client as redisclient } from "../db/redisConnect.js"
import asyncHandler from "./AsyncHandler.utils.js"
import Website from "../models/website.model.js"
import { ApiError } from "./ApiError.utils.js"

// Save website source code to Redis cache
const SavePage = asyncHandler(async (id) => {
    if (!id) {
        throw new ApiError(403, "Id is required", " ");
    }

    try {
        // Fetch website data from database
        const website = await Website.findById(id);
        if (!website) {
            throw new ApiError(404, "Website not found", " ");
        }

        // Convert sourcecode array to string for storage
        const sourceCodeString = JSON.stringify(website.sourcecode);
        
        // Store in Redis with key as website id and value as source code
        await client.setEx(`website:${id}`, 3600, sourceCodeString); // Cache for 1 hour (3600 seconds)
        
        return {
            success: true,
            message: "Website source code cached successfully",
            id: id
        };
    } catch (error) {
        console.error("Error saving page to cache:", error);
        throw new ApiError(500, "Failed to save page to cache", error.message);
    }
});

// Retrieve website source code from Redis cache
const GetPage = asyncHandler(async (id) => {
    if (!id) {
        throw new ApiError(403, "Id is required", " ");
    }

    try {
        // Get from Redis cache first
        const cachedSourceCode = await client.get(`website:${id}`);
        
        if (cachedSourceCode) {
            // Return cached data
            return {
                success: true,
                sourceCode: JSON.parse(cachedSourceCode),
                fromCache: true,
                id: id
            };
        }

        // If not in cache, fetch from database
        const website = await Website.findById(id);
        if (!website) {
            throw new ApiError(404, "Website not found", " ");
        }

        // Cache the data for future requests
        const sourceCodeString = JSON.stringify(website.sourcecode);
        await client.setEx(`website:${id}`, 3600, sourceCodeString);

        return {
            success: true,
            sourceCode: website.sourcecode,
            fromCache: false,
            id: id
        };
    } catch (error) {
        console.error("Error getting page from cache:", error);
        throw new ApiError(500, "Failed to get page from cache", error.message);
    }
});







export {
    SavePage,
    GetPage
};
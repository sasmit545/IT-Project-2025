import { client, client as redisclient } from "../db/redisConnect.js"
import asyncHandler from "./AsyncHandler.utils.js"
import Website from "../models/website.model.js"
import { ApiError } from "./ApiError.utils.js"
const SavePage = asyncHandler( async (id)=>
{
    if(!id)
    {
        throw new ApiError(403,"Id is req"," ");
    }
    
})
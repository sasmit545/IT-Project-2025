import ApiError from "./ApiError.utils.js"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
cloudinary.config({ 
        cloud_name: CLOUDINARY_NAME, 
        api_key: CLOUDINARY_API_KEY, 
        api_secret: CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadToCloudinary = async (localPath) =>
{
    try {
        if (!localPath) return null
       const response= await cloudinary.uploader.upload(localPath) 
       fs.unlink(localPath)
       return response.url;

        
    } catch (error) {
        fs.unlink(localPath)
        throw new ApiError(500,"Error occured while Cloudinary Upload")
    }
}

export default uploadToCloudinary
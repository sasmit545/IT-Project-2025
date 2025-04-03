import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { ApiError } from './ApiError.utils.js';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null
        //console.log(localFilePath)
        const response = await cloudinary.uploader
            .upload(localFilePath, {
                resource_type:'auto'
            })
       // console.log("file is uploaded on cloudinary", response);
        fs.unlinkSync(localFilePath)
        return response;



    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.error("Error uploading to Cloudinary:", error);// if failed we remove from local path
        return null
    }
}

function getPublicIdFromUrl(url) {
    // Use a regular expression to extract the public ID
    const regex = /\/v\d+\/([^\/]+)\.\w+$/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

const deleteFromCloudinary = async (OnlineFilePath) => {
    try {
        if (!OnlineFilePath) return null
        
        const path = getPublicIdFromUrl(OnlineFilePath)
        const response = await cloudinary.uploader.destroy(path)
        if (response.result == 'ok') {
            console.log("media deleted from cloudinary")
        }
        else {
            console.log("media not deleted from cloudinary or it didnt existed")
        }

    } catch (error) {
        throw new ApiError(500, "Unable to delete from Cloudinary Online",error)
    }
}

export { uploadCloudinary, deleteFromCloudinary }

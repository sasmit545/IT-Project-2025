import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";
import jwt  from "jsonwebtoken";
const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        console.log("JWT verification middleware called")
        // console.log(req.cookies)
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // get access token from cookies or the header of the request
        if (!token) {
            throw new ApiError(401, "Unauthorised Request,User doesnt have access token")
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_AUTH)

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorised Request,User doesnt have valid access token")
        }
        const user = await User.findById(decodedToken._id)
        if (!user) {
            throw new ApiError(401, "Unauthorised Request,User doesnt have valid access token Maybe its expired")

        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorised Request",
            error: error.message
        })
    }
})

export default verifyJwt
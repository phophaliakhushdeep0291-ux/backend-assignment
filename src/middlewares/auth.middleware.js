import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async(req, _,next)=>{
    try {
        const token=req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id).select("-password -RefreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid access token")
    }
})
export const isAdmin = (req, res, next) => {
    // Check if the user exists and has the 'admin' role
    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Access Denied: Admin privileges required");
    }
    next();
};
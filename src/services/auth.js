import jwt from "jsonwebtoken";

import constants from "../config/constants";
import User from "../models/User";

export async function requireAuth(user){
    if(!user || !user._id){
        throw new Error("Unauthorized");
    }

    const me = await User.findById(user._id);
    if(!me){
        throw new Error("Unauthorized");
    }
    
    return me
}


export async function decodeToken(token){
    try {
        const arr = token.split(" ");
    
        if(arr[0] == "Bearer"){
            return(jwt.verify(arr[1], constants.JWT_SECRET));
        }
    } catch (err){
        throw err;
    }
    
    
    throw new Error("Token not valid!") 
}


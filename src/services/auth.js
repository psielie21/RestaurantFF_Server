import jwt from "jsonwebtoken";

import constants from "../config/constants";
import User from "../models/User";

export async function requireAuth(user){
    console.log(user)
    if(!user || !user._id){
        throw new Error("Unauthorized");
    }

    const me = User.findById(user._id);

    if(!me){
        throw new Error("Unathorized");
    }
    
    return me
}

/*
deprecated - using express-jwt now
export async function decodeToken(token){
    const arr = token.split(" ");
    
    if(arr[0] == "Bearer"){
        return(jwt.verify(arr[1], constants.JWT_SECRET));
    }
    
    throw new Error("Token not valid!") 
}

*/
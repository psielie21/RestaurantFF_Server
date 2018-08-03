import mongoose from "mongoose";
import {hashSync, compareSync} from "bcrypt-nodejs";
import jwt from "jsonwebtoken";

import constants from "../config/constants";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    avatar: String,
    recs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation'
    }],
    
}, {timestamps: true});

UserSchema.pre("save", function(next){
    if(this.isModified("password")){
        this.password = this._hashPassword(this.password);
        return next();
    }
    return next();
});

UserSchema.methods = {
    _hashPassword(password){
        return hashSync(password);
    },
    authenticateUser(pwd){
        return compareSync(pwd, this.password)
    },
    createToken(){
        return jwt.sign( {_id: this._id} , constants.JWT_SECRET);
    }
}

export default mongoose.model("User", UserSchema);
import mongoose from "mongoose";
import {hashSync, compareSync} from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import validator from "mongoose-unique-validator";

import constants from "../config/constants";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
        index: true,
    },
    password: {
        type: String,
        required: true
        },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true
        },
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

UserSchema.plugin(validator);


const mod = mongoose.model("User", UserSchema);

mod.on('index', function (err) {
  if (err) console.error(err);
})

export default mod;
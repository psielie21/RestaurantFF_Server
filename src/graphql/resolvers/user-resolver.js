import User from "../../models/User";
import { requireAuth } from "../../services/auth";
import { createWriteStream, readFileSync } from 'fs'
import shortid from 'shortid'
import fs from "fs";

export default {
    signup: async (_, {...rest}) => {
        try {
            const user = await User.create({...rest})
            
            return {
                token: user.createToken()
            }
        }catch (err){
            throw err;
        }
    },
    
    login: async (_, {emailOrUser, password }) => {
        try {
            let user;
            if(emailOrUser.indexOf("@") > -1){
                user = await User.findOne( {email: emailOrUser} );
            }else {
                user = await User.findOne( { username: emailOrUser })
            }
            
            if(!user){
                throw new Error("User not exist!");
            }
            
            if(!user.authenticateUser(password)) {
                throw new Error("Password not match!");
            }
            
            return {
                token: user.createToken()
            }
        }catch (err){
            throw err
        }
    },
    
    me: async (_, args, { user }) => {
        try {
            const me = await requireAuth(user);
            return me;
        } catch (err){
            throw err;
        }
    },
    
    //it is required that one of them is not null
    userProfile: async(_, {email, username}, {user}) => {
        await requireAuth(user);
        try {
            if(email){
                return User.findOne({email})
            }else {
                return User.findOne({username})
            }
        } catch (err) {
            throw err
        }
    },
    
    updateMe: async (_, { profilePicture }, {user}) => {
        const me = await requireAuth(user);
        try {
            const { filename, mimetype, stream } = await profilePicture
            const { id, path } =await storeUpload(stream, me.username);
            console.log(path)
            const pathInDb = "https://restaurant-ff-server-psielie.c9users.io/" + path;
            const newMe = await User.findOneAndUpdate({ _id: me._id }, { avatar: pathInDb });
            console.log(newMe);
            return newMe;
        } catch(err) {
            console.log(err);
            throw err;
        }
    },
    
    users: async (_, args, {user}) => {
        await requireAuth(user);
        try {
            const users = User.find( {} )
            return users;
        } catch (err) {
            throw err
        }
    },
}

const storeUpload = async(stream, username) =>{
    //check if the user has an asset folder already
    try {
        fs.mkdirSync(`static/${username}`)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
    
    const id = shortid.generate();
    const path = `static/${username}/${id}.jpg`
    
    return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject),
    )
}
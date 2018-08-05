import User from "../../models/User";
import { requireAuth } from "../../services/auth";

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
    
    login: async (_, {email, password }) => {
        try {
            const user = await User.findOne( {email} );
            
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
    
    users: async (_, args, {user}) => {
        await requireAuth(user);
        try {
            const users = User.find( {} )
            return users;
        } catch (err) {
            throw err
        }
    },
    
    deleteUsers: async (_, args, {user}) => {
        await requireAuth(user);
        try {
            await User.collection.drop();
            return User.find({})
        } catch (err){
            throw err
        }
    }
    
}
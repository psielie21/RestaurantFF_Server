import Recommendation from "../../models/Recommendation";
import Restaurant from "../../models/Restaurant";
import User from "../../models/User";
import { requireAuth } from "../../services/auth";

export default {
    createRecommendation: async (_, {restaurant, body}, {user}) => {
        try {
            //check if the recommendation is a valid restaurant in the local db
            const found = await Restaurant.findById({_id: restaurant})
            if(found){
                const rec = await Recommendation.create({body, author: user._id, restaurant});
                const me = await requireAuth(user);
                let recs = me.recs;
                await recs.push(rec)
                User.findOneAndUpdate({_id: user._id}, {recs}, function(err, res){
                    if(err) console.error(err);
                    //console.log(res);
                })
                return rec
            }
            throw new Error("Restaurant could not be found!");
            
        } catch (err){
            throw err
        }
    },
    
    getRecommendations : async (_, args, {user}) => {
        try {
            return Recommendation.find({})
        }catch (err){
            throw err
        }
    },
    
    deleteRecommendation: async (_, {_id}, {user}) => {
        try {
            return Recommendation.deleteOne({_id})
        } catch (err){
            throw err
        }
    },
    
    getRestaurants: async (_, {location}, user) => {
        
    },
    
    getNearbyRecommendations: async (_, {location}, user) => {
        
    }
}
import Recommendation from "../../models/Recommendation";
import Restaurant from "../../models/Restaurant";
import User from "../../models/User";
import { requireAuth } from "../../services/auth";

export default {
    createRecommendation: async (_, {restaurant, body}, {user}) => {
        await requireAuth(user);
        try {
            //check if the recommendation is a valid restaurant in the local db
            const found = await Restaurant.findById({_id: restaurant})
            if(found){
                const rec = await Recommendation.create({body, author: user._id, restaurant, location: {type: "Point", coordinates: [found.location.coordinates[0], found.location.coordinates[1]]}});
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
    
    getNearbyRecommendations: async (_, { coords, distance }, {user}) => {
        if(coords){
            let lat, lon;
        try {
            //location should come in as an array of strings
            lon = parseFloat(coords.split(",")[0]);
            lat = parseFloat(coords.split(",")[1]);
        } catch(err){
            throw new Error("Invalid location format!")
        }
        
        let rests = await Recommendation.find({
          location: {
           $nearSphere: {
            $geometry: {
             type: "Point",
             coordinates: [lon, lat]
            },
            $maxDistance: distance
           }
          }
         });

        return rests;
        }else {
            throw new Error("Undefined coordinates!");
        }
    },
    
    deleteRecommendation: async (_, {_id}, {user}) => {
        await requireAuth(user);
        try {
            const rec = await Recommendation.findOne({_id})
            if(rec.author._id == user._id){
                return Recommendation.deleteOne({_id})
            }else {
                throw new Error("Unauthorized!");
            }
        } catch (err){
            throw err
        }
    },
    
    getRecommendations: async (_, args, {user}) => {
        await requireAuth(user);
        return Recommendation.find({})
    }

}
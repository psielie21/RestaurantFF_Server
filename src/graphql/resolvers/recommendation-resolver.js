import Recommendation from "../../models/Recommendation";
import Restaurant from "../../models/Restaurant";
import User from "../../models/User";
import { requireAuth } from "../../services/auth";

export default {
    createRecommendation: async (_, {restaurant, body, restName, lat, lon}, {user}) => {
        const me = await requireAuth(user);
        try {
            //OpenStreetMap IDs have a length of 10
            if(restaurant.length == 10){
                //create a restaurant entry in the local db first
                const newlyCreated = await Restaurant.create({api_id: restaurant, name: restName, location: {type: "Point", coordinates: [lat, lon]} })
                restaurant = newlyCreated._id;
            }
            //check if the recommendation is a valid restaurant in the local db
            const found = await Restaurant.findById({_id: restaurant})
            if(found){
                const rec = await Recommendation.create({body, author: user._id, restaurant, location: {type: "Point", coordinates: [found.location.coordinates[0], found.location.coordinates[1]]}});
                let recs = me.recs;
                await recs.push(rec)
                User.findOneAndUpdate({_id: user._id}, {recs}, function(err, res){
                    if(err) console.error(err);
                    //console.log(res);
                })
                let recommendations = found.recommendations;
                await recommendations.push(rec)
                Restaurant.findOneAndUpdate({_id: restaurant}, {recommendations}, function(err, res){
                    if(err) console.error(err);
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
        
        if(!distance){
            distance = 10000
        }
        let rests = await Restaurant.find({
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
        
        let recs = await Recommendation.find({
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
        const me = await requireAuth(user);
        try {
            const rec = await Recommendation.findOne({_id})
            if(rec.author._id == user._id){
                await Recommendation.deleteOne({_id});
                let recs = me.recs;
                const newRecs = recs.filter( el => el._id != _id)
                console.log(newRecs);
                User.findOneAndUpdate({_id: user._id}, {recs: newRecs}, function(err, res){
                    if(err) console.error(err);
                    console.log(res);
                })
                
                const found = await Restaurant.findById({_id: rec.restaurant});
                let recommendations = found.recommendations;
                const newRecsRest = recommendations.filter( el => el._id != rec._id)
                Restaurant.findOneAndUpdate({_id: rec.restaurant}, {newRecsRest}, function(err, res){
                    if(err) console.error(err);
                })
                
                return rec;
            }else {
                throw new Error("Unauthorized!");
            }
        } catch (err){
            console.log(err.stack);
            console.log(err.lineNumber);
            throw err
        }
    },
    
    getRecommendations: async (_, args, {user}) => {
        await requireAuth(user);
        return Recommendation.find({})
    }

}
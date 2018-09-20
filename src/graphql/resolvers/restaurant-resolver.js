import Restaurant from "../../models/Restaurant";
import Recommendation from "../../models/Recommendation";
import User from "../../models/User";
import { requireAuth } from "../../services/auth";

import overpass from "../../services/overpass";

export default {
    //a restaurant that will be added to the db by the user BUT is NOT in the OSM
    addRestaurant: async (_, {coords, body, rating, ...rest}, {user}) => {
        const me = await requireAuth(user);
        let lat, lon;
        if(!body || !rating) throw new Error("Restaurant needs to have a recommendation along with it");
        if(coords && rest.name){
            try {
                //location should come in as an array of strings
                lon = parseFloat(coords.split(",")[0]);
                lat = parseFloat(coords.split(",")[1]);
            } catch(err){
                throw new Error("Invalid location format!")
            }
        }else {
            throw new Error("As of rn we need coords and the restaurant name!")
        }
        try {
            
            const restaurant = await Restaurant.create({confirmed: false, location: {type: "Point", coordinates: [lon, lat]} ,...rest})
            const rec = await Recommendation.create({body, rating, author: user._id, restaurant, location: {type: "Point", coordinates: [lon, lat]}});
            let recs = me.recs;
            await recs.push(rec)
            User.findOneAndUpdate({_id: user._id}, {recs}, function(err, res){
                if(err) console.error(err);
                //console.log(res);
            })
            let recommendations = restaurant.recommendations;
            await recommendations.push(rec)
            Restaurant.findOneAndUpdate({_id: restaurant}, {recommendations}, function(err, res){
                if(err) console.error(err);
            })
            return restaurant;
        } catch (err){
            throw err
        }
    },
    
    getRestaurants: async (_, { coords, name }, {user}) => {
        await requireAuth(user);
        if(coords){
            let lat, lon;
        try {
            //location should come in as an array of strings
            lon = parseFloat(coords.split(",")[0]);
            lat = parseFloat(coords.split(",")[1]);
        } catch(err){
            throw new Error("Invalid location format!")
        }

        let overpassPromise = new Promise(
                (resolve, reject) => {
                    overpass(lon, lat, function(err, data){
                        if(err) reject(err);
                        resolve(data)
                        
                    })
                }
            );
        
        
        let restaurantPormise = new Promise(
                (resolve, reject) => {
                    Restaurant.find({
                      location: {
                       $nearSphere: {
                        $geometry: {
                         type: "Point",
                         coordinates: [lon, lat]
                        },
                        $maxDistance: 100
                       }
                      }
                     }, function(err, data){
                         if(err) reject(err);
                         resolve(data);
                     })
                }    
            );
        
        
        return Promise.all([overpassPromise, restaurantPormise])
        .then(values => {
          values[1].push(...values[0])// values is an array with two elements both arrays.
          return values[1];
        });
        
        }else if(name){
            //more advanced regex 
            //1. lower vs upper case
            //2. return limited results based on location - ip
            return Restaurant.find({
                "name": {$regex: ".*" + name + ".*"}
            });
        }else {
            throw new Error("Both args undefined!");
        }
        
    }
}
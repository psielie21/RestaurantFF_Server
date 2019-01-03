import Restaurant from "../../models/Restaurant";
import Recommendation from "../../models/Recommendation";
import User from "../../models/User";
import { requireAuth } from "../../services/auth";
import GeoDistance from "geo-distance";
import overpass, {queryBox} from "../../services/overpass";
import constants from "../../config/constants";

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
    
    //about to deprecate this method - getBoxBasedRestaurant() is the preferred method
    getLocationBasedRestaurants: async (_, { coords }, {user}) => {
        await requireAuth(user);
        let lon,lat;
        try {
            //location should come in as an array of strings
            lon = parseFloat(coords.split(",")[0]);
            lat = parseFloat(coords.split(",")[1]);
        } catch(err){
            throw new Error("Invalid location format!")
        }
        
        return new Promise(
                (resolve, reject) => {
                    overpass(lon, lat, function(err, data){
                        if(err) reject(err);
                        resolve(data)
                    })
                }
            );
    },
    
    getBoxBasedRestaurants: async (_, { lat1, lon1, lat2, lon2}, {user}) => {
        await requireAuth(user);
        const coords = {
            lat1, 
            lon1,
            lat2,
            lon2,
        };
        //make sure those coordinates are not too far apart
        const delta = {
            latDelta: Math.abs(lat2 - lat1),
            lonDelta: Math.abs(lon2 - lon1),
        };
        const newCenter = {
            lon: lon1 + delta.lonDelta/2,
            lat: lat1 + delta.latDelta/2,
        };
        const distance = GeoDistance.between({lat: lat1, lon: lon1},
                                            {lat: lat2, lon: lon2}).human_readable();
        const radius = distance.unit === "m" ? distance.distance : distance.distance * 1000;

                                            
        if(delta.latDelta > constants.MAX_LATITUDE_DELTA || delta.lonDelta > constants.MAX_LONGITUDE_DELTA){
            console.log("LatDelta: " + delta.latDelta);
            throw new Error("Specified search box too large!");
        }
        
        console.log("Radius: " + radius + ". Center: " + newCenter);
        
        let overpassPromise = new Promise(
                (resolve, reject) => {
                    queryBox(coords, function(err, data){
                        if(err) reject(err);
                        resolve(data);
                    })
                }
            );
        //The coords specify a rectangular box
        //we take the midpoint and the diagonal for querying our db
        let restaurantPromise = new Promise(
                (resolve, reject) => {
                    Restaurant.find({
                      location: {
                       $nearSphere: {
                        $geometry: {
                         type: "Point",
                         coordinates: [newCenter.lon, newCenter.lat]
                        },
                        $maxDistance: radius
                       }
                      }
                     }, function(err, data){
                         if(err) reject(err);
                         resolve(data);
                     })
                }    
        );
        
        return Promise.all([overpassPromise, restaurantPromise])
        .then(values => {
            let overpassArray = values[0];
            let localArray = values[1];
            //console.log("LocalArray: " + localArray);
            
            //filter the overpassArray so it doesnt contain duplicate elements
            for(let i = 0; i < localArray.length; i++){
                overpassArray = overpassArray.filter( el => el._id != localArray[i].api_id);
            }
            localArray.push(...overpassArray)
            return localArray;
        });
    },
    
    //get restaurants from the api and the db so the user can write a recommendation
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
        
        
        let restaurantPromise = new Promise(
                (resolve, reject) => {
                    Restaurant.find({
                      location: {
                       $nearSphere: {
                        $geometry: {
                         type: "Point",
                         coordinates: [lon, lat]
                        },
                        $maxDistance: 500
                       }
                      }
                     }, function(err, data){
                         if(err) reject(err);
                         resolve(data);
                     })
                }    
        );
        
        
        return Promise.all([overpassPromise, restaurantPromise])
        .then(values => {
            let overpassArray = values[0];
            let localArray = values[1];
            
            //filter the overpassArray so it doesnt contain duplicate elements
            for(let i = 0; i < localArray.length; i++){
                overpassArray = overpassArray.filter( el => el._id != localArray[i].api_id);
            }
            localArray.push(...overpassArray)
            return localArray;
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
import Restaurant from "../../models/Restaurant";
import { requireAuth } from "../../services/auth";

export default {
    addRestaurant: async (_, {coords, ...rest}, {user}) => {
        await requireAuth(user);
        let lat, lon;
        try {
            //location should come in as an array of strings
            lon = parseFloat(coords.split(",")[0]);
            lat = parseFloat(coords.split(",")[1]);
        } catch(err){
            throw new Error("Invalid location format!")
        }
        
        try {
            const r = await Restaurant.create({location: {type: "Point", coordinates: [lon, lat]} ,...rest})
            return r;
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
        
        //first query the Restaurants db
        let rests = await Restaurant.find({
          location: {
           $nearSphere: {
            $geometry: {
             type: "Point",
             coordinates: [lon, lat]
            },
            $maxDistance: 100
           }
          }
         });
         
         if(rests.length == 0){
             //insert external api here
         }
         
         return rests;
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
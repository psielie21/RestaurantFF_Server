import mongoose from "mongoose";

const RestaurantSchema = mongoose.Schema({
    name: String,
    type: String,
    coords: [String],
    phone: String,
    thirdPartyId: String,
    website: String,
    country: String,
    adress: String,
    city: String,
    zip: String
    
});

export default mongoose.model("Restaurant", RestaurantSchema);


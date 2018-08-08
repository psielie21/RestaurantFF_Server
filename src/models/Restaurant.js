import mongoose from "mongoose";

const RestaurantSchema = mongoose.Schema({
    name: String,
    type: String,
    location: {type: {type: String},
               coordinates: [Number]},
    phone: String,
    thirdPartyId: String,
    website: String,
    country: String,
    adress: String,
    city: String,
    zip: String
    
});

RestaurantSchema.index({ location: "2dsphere" });

const restm = mongoose.model("Restaurant", RestaurantSchema);

restm.on('index', function (err) {
  if (err) console.error(err);
})

export default restm;


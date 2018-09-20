import mongoose from "mongoose";

const RestaurantSchema = mongoose.Schema({
    name: String,
    type: String,
    location: {type: {type: String},
               coordinates: [Number]},
    recommendations: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Recommendation",
    },
    api_id: String,
    phone: String,
    thirdPartyId: String,
    website: String,
    country: String,
    adress: String,
    city: String,
    zip: String,
    confirmed: Boolean,
    confirmationCount: Number,
    
});

RestaurantSchema.index({ location: "2dsphere" });

const restm = mongoose.model("Restaurant", RestaurantSchema);

restm.on('index', function (err) {
  if (err) console.error(err);
})

export default restm;


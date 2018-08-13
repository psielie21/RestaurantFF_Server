import mongoose from "mongoose";

const RecommendationSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    body: {
        type: String,
        maxlength: [1500, "text too long"]
    },
    pictures: [String],
    location: {
        type: {type: String},
        coordinates: [Number],
    }
    
}, {timestamps: true});

RecommendationSchema.index({ location: "2dsphere" });


export default mongoose.model("Recommendation", RecommendationSchema);


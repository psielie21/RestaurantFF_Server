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
    
}, {timestamps: true});

export default mongoose.model("Recommendation", RecommendationSchema);


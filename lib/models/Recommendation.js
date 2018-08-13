"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RecommendationSchema = _mongoose2.default.Schema({
    author: {
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: "User"
    },
    restaurant: {
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    body: {
        type: String,
        maxlength: [1500, "text too long"]
    },
    pictures: [String],
    location: {
        type: { type: String },
        coordinates: [Number]
    }

}, { timestamps: true });

RecommendationSchema.index({ location: "2dsphere" });

exports.default = _mongoose2.default.model("Recommendation", RecommendationSchema);
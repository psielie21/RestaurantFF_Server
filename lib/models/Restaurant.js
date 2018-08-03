"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RestaurantSchema = _mongoose2.default.Schema({
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

exports.default = _mongoose2.default.model("Restaurant", RestaurantSchema);
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (currLon, currLat, cb) {
    var delta = 0.005;
    var lat1 = currLat - delta;
    var lon1 = currLon - delta;
    var lat2 = currLat + delta;
    var lon2 = currLon + delta;

    var GET_NEARBY_RESTAURANTS = "(\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"cafe\"];\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"restaurant\"];\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"bar\"];\n    );\n    out body;\n    >;\n    out skel qt;";

    var now = Date.now();
    (0, _queryOverpass2.default)(GET_NEARBY_RESTAURANTS, function (err, data) {
        var difference = Date.now() - now;
        console.log(difference);
        cb(err, convertOpenMaps(data["features"]));
    });
};

var _queryOverpass = require("query-overpass");

var _queryOverpass2 = _interopRequireDefault(_queryOverpass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertOpenMaps(features) {
    var returnArr = [];
    for (var i = 0; i < features.length; i++) {
        var lon = features[i].geometry.coordinates[0];
        var lat = features[i].geometry.coordinates[1];
        returnArr[i] = {
            name: features[i].properties.tags.name,
            location: {
                coordinates: [lat, lon],
                type: "Point"

            },
            _id: features[i].properties.id,
            recommendations: null
        };
    }
    return returnArr;
}
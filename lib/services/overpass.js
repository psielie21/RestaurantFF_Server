"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryBox = undefined;

exports.default = function (currLon, currLat, cb) {
    var delta = 0.002;
    var lat1 = currLat - delta;
    var lon1 = currLon - delta;
    var lat2 = currLat + delta;
    var lon2 = currLon + delta;

    var GET_NEARBY_RESTAURANTS = "(\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"cafe\"];\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"restaurant\"];\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"bar\"];\n    );\n    out body;\n    >;\n    out skel qt;";

    var now = Date.now();
    (0, _queryOverpass2.default)(GET_NEARBY_RESTAURANTS, function (err, data) {
        if (err) throw err;
        var difference = Date.now() - now;
        console.log("Time taken for querying restaurants: " + difference);
        cb(err, convertOpenMaps(data["features"]));
    });
};

var _queryOverpass = require("query-overpass");

var _queryOverpass2 = _interopRequireDefault(_queryOverpass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queryBox(coords, cb) {
    var lat1 = void 0,
        lat2 = void 0,
        lon1 = void 0,
        lon2 = void 0;
    try {
        lat1 = coords.lat1;
        lon1 = coords.lon1;
        lat2 = coords.lat2;
        lon2 = coords.lon2;
    } catch (e) {
        throw new Error("Coords not valid!");
        return;
    }

    var GET_NEARBY_RESTAURANTS = "(\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"cafe\"];\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"restaurant\"];\n      node(" + lat1 + ", " + lon1 + ", " + lat2 + ", " + lon2 + ")[\"amenity\" = \"bar\"];\n    );\n    out body;\n    >;\n    out skel qt;";

    var now = Date.now();
    console.log(GET_NEARBY_RESTAURANTS);
    (0, _queryOverpass2.default)(GET_NEARBY_RESTAURANTS, function (err, data) {
        if (err) {
            console.log(err.message);
            cb(err, null);
        }

        var difference = Date.now() - now;
        console.log(difference);
        try {
            var feat = data["features"];
            cb(err, convertOpenMaps(data["features"]));
        } catch (e) {
            cb(e, null);
        }
    });
}

exports.queryBox = queryBox;


function convertOpenMaps(features) {
    var returnArr = [];
    for (var i = 0; i < features.length; i++) {
        var lon = features[i].geometry.coordinates[1];
        var lat = features[i].geometry.coordinates[0];

        //hackish hack for when the name of the restaurant is undefined
        if (!features[i].properties.tags.name) {
            features[i].properties.tags.name = "Undefined Name";
        }
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
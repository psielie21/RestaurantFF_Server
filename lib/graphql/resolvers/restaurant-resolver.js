"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Restaurant = require("../../models/Restaurant");

var _Restaurant2 = _interopRequireDefault(_Restaurant);

var _Recommendation = require("../../models/Recommendation");

var _Recommendation2 = _interopRequireDefault(_Recommendation);

var _User = require("../../models/User");

var _User2 = _interopRequireDefault(_User);

var _auth = require("../../services/auth");

var _geoDistance = require("geo-distance");

var _geoDistance2 = _interopRequireDefault(_geoDistance);

var _overpass = require("../../services/overpass");

var _overpass2 = _interopRequireDefault(_overpass);

var _constants = require("../../config/constants");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //a restaurant that will be added to the db by the user BUT is NOT in the OSM
    addRestaurant: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, _ref, _ref2) {
            var coords = _ref.coords,
                body = _ref.body,
                rating = _ref.rating,
                rest = _objectWithoutProperties(_ref, ["coords", "body", "rating"]);

            var user = _ref2.user;
            var me, lat, lon, restaurant, rec, recs, recommendations;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            me = _context.sent;
                            lat = void 0, lon = void 0;

                            if (!(!body || !rating)) {
                                _context.next = 6;
                                break;
                            }

                            throw new Error("Restaurant needs to have a recommendation along with it");

                        case 6:
                            if (!(coords && rest.name)) {
                                _context.next = 17;
                                break;
                            }

                            _context.prev = 7;

                            //location should come in as an array of strings
                            lon = parseFloat(coords.split(",")[0]);
                            lat = parseFloat(coords.split(",")[1]);
                            _context.next = 15;
                            break;

                        case 12:
                            _context.prev = 12;
                            _context.t0 = _context["catch"](7);
                            throw new Error("Invalid location format!");

                        case 15:
                            _context.next = 18;
                            break;

                        case 17:
                            throw new Error("As of rn we need coords and the restaurant name!");

                        case 18:
                            _context.prev = 18;
                            _context.next = 21;
                            return _Restaurant2.default.create(_extends({ confirmed: false, location: { type: "Point", coordinates: [lon, lat] } }, rest));

                        case 21:
                            restaurant = _context.sent;
                            _context.next = 24;
                            return _Recommendation2.default.create({ body: body, rating: rating, author: user._id, restaurant: restaurant, location: { type: "Point", coordinates: [lon, lat] } });

                        case 24:
                            rec = _context.sent;
                            recs = me.recs;
                            _context.next = 28;
                            return recs.push(rec);

                        case 28:
                            _User2.default.findOneAndUpdate({ _id: user._id }, { recs: recs }, function (err, res) {
                                if (err) console.error(err);
                                //console.log(res);
                            });
                            recommendations = restaurant.recommendations;
                            _context.next = 32;
                            return recommendations.push(rec);

                        case 32:
                            _Restaurant2.default.findOneAndUpdate({ _id: restaurant }, { recommendations: recommendations }, function (err, res) {
                                if (err) console.error(err);
                            });
                            return _context.abrupt("return", restaurant);

                        case 36:
                            _context.prev = 36;
                            _context.t1 = _context["catch"](18);
                            throw _context.t1;

                        case 39:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[7, 12], [18, 36]]);
        }));

        function addRestaurant(_x, _x2, _x3) {
            return _ref3.apply(this, arguments);
        }

        return addRestaurant;
    }(),

    //about to deprecate this method - getBoxBasedRestaurant() is the preferred method
    getLocationBasedRestaurants: function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, _ref4, _ref5) {
            var coords = _ref4.coords;
            var user = _ref5.user;
            var lon, lat;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            lon = void 0, lat = void 0;
                            _context2.prev = 3;

                            //location should come in as an array of strings
                            lon = parseFloat(coords.split(",")[0]);
                            lat = parseFloat(coords.split(",")[1]);
                            _context2.next = 11;
                            break;

                        case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2["catch"](3);
                            throw new Error("Invalid location format!");

                        case 11:
                            return _context2.abrupt("return", new Promise(function (resolve, reject) {
                                (0, _overpass2.default)(lon, lat, function (err, data) {
                                    if (err) reject(err);
                                    resolve(data);
                                });
                            }));

                        case 12:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[3, 8]]);
        }));

        function getLocationBasedRestaurants(_x4, _x5, _x6) {
            return _ref6.apply(this, arguments);
        }

        return getLocationBasedRestaurants;
    }(),

    getBoxBasedRestaurants: function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_, _ref7, _ref8) {
            var lat1 = _ref7.lat1,
                lon1 = _ref7.lon1,
                lat2 = _ref7.lat2,
                lon2 = _ref7.lon2;
            var user = _ref8.user;
            var coords, delta, newCenter, distance, radius, overpassPromise, restaurantPromise;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            coords = {
                                lat1: lat1,
                                lon1: lon1,
                                lat2: lat2,
                                lon2: lon2
                            };
                            //make sure those coordinates are not too far apart

                            delta = {
                                latDelta: Math.abs(lat2 - lat1),
                                lonDelta: Math.abs(lon2 - lon1)
                            };
                            newCenter = {
                                lon: lon1 + delta.lonDelta / 2,
                                lat: lat1 + delta.latDelta / 2
                            };
                            distance = _geoDistance2.default.between({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }).human_readable();
                            radius = distance.unit === "m" ? distance.distance : distance.distance * 1000;

                            if (!(delta.latDelta > _constants2.default.MAX_LATITUDE_DELTA || delta.lonDelta > _constants2.default.MAX_LONGITUDE_DELTA)) {
                                _context3.next = 10;
                                break;
                            }

                            console.log("LatDelta: " + delta.latDelta);
                            throw new Error("Specified search box too large!");

                        case 10:

                            console.log("Radius: " + radius + ". Center: " + newCenter);

                            overpassPromise = new Promise(function (resolve, reject) {
                                (0, _overpass.queryBox)(coords, function (err, data) {
                                    if (err) reject(err);
                                    resolve(data);
                                });
                            });
                            //The coords specify a rectangular box
                            //we take the midpoint and the diagonal for querying our db

                            restaurantPromise = new Promise(function (resolve, reject) {
                                _Restaurant2.default.find({
                                    location: {
                                        $nearSphere: {
                                            $geometry: {
                                                type: "Point",
                                                coordinates: [newCenter.lon, newCenter.lat]
                                            },
                                            $maxDistance: radius
                                        }
                                    }
                                }, function (err, data) {
                                    if (err) reject(err);
                                    resolve(data);
                                });
                            });
                            return _context3.abrupt("return", Promise.all([overpassPromise, restaurantPromise]).then(function (values) {
                                var overpassArray = values[0];
                                var localArray = values[1];
                                //console.log("LocalArray: " + localArray);

                                //filter the overpassArray so it doesnt contain duplicate elements

                                var _loop = function _loop(i) {
                                    overpassArray = overpassArray.filter(function (el) {
                                        return el._id != localArray[i].api_id;
                                    });
                                };

                                for (var i = 0; i < localArray.length; i++) {
                                    _loop(i);
                                }
                                localArray.push.apply(localArray, _toConsumableArray(overpassArray));
                                return localArray;
                            }));

                        case 14:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        }));

        function getBoxBasedRestaurants(_x7, _x8, _x9) {
            return _ref9.apply(this, arguments);
        }

        return getBoxBasedRestaurants;
    }(),

    //get restaurants from the api and the db so the user can write a recommendation
    getRestaurants: function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_, _ref10, _ref11) {
            var coords = _ref10.coords,
                name = _ref10.name;
            var user = _ref11.user;
            var lat, lon, overpassPromise, restaurantPromise;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            if (!coords) {
                                _context4.next = 17;
                                break;
                            }

                            lat = void 0, lon = void 0;
                            _context4.prev = 4;

                            //location should come in as an array of strings
                            lon = parseFloat(coords.split(",")[0]);
                            lat = parseFloat(coords.split(",")[1]);
                            _context4.next = 12;
                            break;

                        case 9:
                            _context4.prev = 9;
                            _context4.t0 = _context4["catch"](4);
                            throw new Error("Invalid location format!");

                        case 12:
                            overpassPromise = new Promise(function (resolve, reject) {
                                (0, _overpass2.default)(lon, lat, function (err, data) {
                                    if (err) reject(err);
                                    resolve(data);
                                });
                            });
                            restaurantPromise = new Promise(function (resolve, reject) {
                                _Restaurant2.default.find({
                                    location: {
                                        $nearSphere: {
                                            $geometry: {
                                                type: "Point",
                                                coordinates: [lon, lat]
                                            },
                                            $maxDistance: 500
                                        }
                                    }
                                }, function (err, data) {
                                    if (err) reject(err);
                                    resolve(data);
                                });
                            });
                            return _context4.abrupt("return", Promise.all([overpassPromise, restaurantPromise]).then(function (values) {
                                var overpassArray = values[0];
                                var localArray = values[1];

                                //filter the overpassArray so it doesnt contain duplicate elements

                                var _loop2 = function _loop2(i) {
                                    overpassArray = overpassArray.filter(function (el) {
                                        return el._id != localArray[i].api_id;
                                    });
                                };

                                for (var i = 0; i < localArray.length; i++) {
                                    _loop2(i);
                                }
                                localArray.push.apply(localArray, _toConsumableArray(overpassArray));
                                return localArray;
                            }));

                        case 17:
                            if (!name) {
                                _context4.next = 21;
                                break;
                            }

                            return _context4.abrupt("return", _Restaurant2.default.find({
                                "name": { $regex: ".*" + name + ".*" }
                            }));

                        case 21:
                            throw new Error("Both args undefined!");

                        case 22:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[4, 9]]);
        }));

        function getRestaurants(_x10, _x11, _x12) {
            return _ref12.apply(this, arguments);
        }

        return getRestaurants;
    }()
};
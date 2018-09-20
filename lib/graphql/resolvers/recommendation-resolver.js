"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Recommendation = require("../../models/Recommendation");

var _Recommendation2 = _interopRequireDefault(_Recommendation);

var _Restaurant = require("../../models/Restaurant");

var _Restaurant2 = _interopRequireDefault(_Restaurant);

var _User = require("../../models/User");

var _User2 = _interopRequireDefault(_User);

var _auth = require("../../services/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    createRecommendation: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, _ref, _ref2) {
            var restaurant = _ref.restaurant,
                body = _ref.body,
                restName = _ref.restName,
                lat = _ref.lat,
                lon = _ref.lon;
            var user = _ref2.user;
            var me, newlyCreated, found, rec, recs, recommendations;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            me = _context.sent;
                            _context.prev = 3;

                            if (!(restaurant.length == 10)) {
                                _context.next = 9;
                                break;
                            }

                            _context.next = 7;
                            return _Restaurant2.default.create({ api_id: restaurant, name: restName, location: { type: "Point", coordinates: [lat, lon] } });

                        case 7:
                            newlyCreated = _context.sent;

                            restaurant = newlyCreated._id;

                        case 9:
                            _context.next = 11;
                            return _Restaurant2.default.findById({ _id: restaurant });

                        case 11:
                            found = _context.sent;

                            if (!found) {
                                _context.next = 25;
                                break;
                            }

                            _context.next = 15;
                            return _Recommendation2.default.create({ body: body, author: user._id, restaurant: restaurant, location: { type: "Point", coordinates: [found.location.coordinates[0], found.location.coordinates[1]] } });

                        case 15:
                            rec = _context.sent;
                            recs = me.recs;
                            _context.next = 19;
                            return recs.push(rec);

                        case 19:
                            _User2.default.findOneAndUpdate({ _id: user._id }, { recs: recs }, function (err, res) {
                                if (err) console.error(err);
                                //console.log(res);
                            });
                            recommendations = found.recommendations;
                            _context.next = 23;
                            return recommendations.push(rec);

                        case 23:
                            _Restaurant2.default.findOneAndUpdate({ _id: restaurant }, { recommendations: recommendations }, function (err, res) {
                                if (err) console.error(err);
                            });
                            return _context.abrupt("return", rec);

                        case 25:
                            throw new Error("Restaurant could not be found!");

                        case 28:
                            _context.prev = 28;
                            _context.t0 = _context["catch"](3);
                            throw _context.t0;

                        case 31:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[3, 28]]);
        }));

        function createRecommendation(_x, _x2, _x3) {
            return _ref3.apply(this, arguments);
        }

        return createRecommendation;
    }(),

    getNearbyRecommendations: function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, _ref4, _ref5) {
            var coords = _ref4.coords,
                distance = _ref4.distance;
            var user = _ref5.user;
            var lat, lon, rests, recs;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!coords) {
                                _context2.next = 20;
                                break;
                            }

                            lat = void 0, lon = void 0;
                            _context2.prev = 2;

                            //location should come in as an array of strings
                            lon = parseFloat(coords.split(",")[0]);
                            lat = parseFloat(coords.split(",")[1]);
                            _context2.next = 10;
                            break;

                        case 7:
                            _context2.prev = 7;
                            _context2.t0 = _context2["catch"](2);
                            throw new Error("Invalid location format!");

                        case 10:

                            if (!distance) {
                                distance = 10000;
                            }
                            _context2.next = 13;
                            return _Restaurant2.default.find({
                                location: {
                                    $nearSphere: {
                                        $geometry: {
                                            type: "Point",
                                            coordinates: [lon, lat]
                                        },
                                        $maxDistance: distance
                                    }
                                }
                            });

                        case 13:
                            rests = _context2.sent;
                            _context2.next = 16;
                            return _Recommendation2.default.find({
                                location: {
                                    $nearSphere: {
                                        $geometry: {
                                            type: "Point",
                                            coordinates: [lon, lat]
                                        },
                                        $maxDistance: distance
                                    }
                                }
                            });

                        case 16:
                            recs = _context2.sent;
                            return _context2.abrupt("return", rests);

                        case 20:
                            throw new Error("Undefined coordinates!");

                        case 21:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[2, 7]]);
        }));

        function getNearbyRecommendations(_x4, _x5, _x6) {
            return _ref6.apply(this, arguments);
        }

        return getNearbyRecommendations;
    }(),

    deleteRecommendation: function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_, _ref7, _ref8) {
            var _id = _ref7._id;
            var user = _ref8.user;
            var me, rec, recs, newRecs, found, recommendations, newRecsRest;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            me = _context3.sent;
                            _context3.prev = 3;
                            _context3.next = 6;
                            return _Recommendation2.default.findOne({ _id: _id });

                        case 6:
                            rec = _context3.sent;

                            if (!(rec.author._id == user._id)) {
                                _context3.next = 23;
                                break;
                            }

                            _context3.next = 10;
                            return _Recommendation2.default.deleteOne({ _id: _id });

                        case 10:
                            recs = me.recs;
                            newRecs = recs.filter(function (el) {
                                return el._id != _id;
                            });

                            console.log(newRecs);
                            _User2.default.findOneAndUpdate({ _id: user._id }, { recs: newRecs }, function (err, res) {
                                if (err) console.error(err);
                                console.log(res);
                            });

                            _context3.next = 16;
                            return _Restaurant2.default.findById({ _id: rec.restaurant });

                        case 16:
                            found = _context3.sent;
                            recommendations = found.recommendations;
                            newRecsRest = recommendations.filter(function (el) {
                                return el._id != rec._id;
                            });

                            _Restaurant2.default.findOneAndUpdate({ _id: rec.restaurant }, { newRecsRest: newRecsRest }, function (err, res) {
                                if (err) console.error(err);
                            });

                            return _context3.abrupt("return", rec);

                        case 23:
                            throw new Error("Unauthorized!");

                        case 24:
                            _context3.next = 31;
                            break;

                        case 26:
                            _context3.prev = 26;
                            _context3.t0 = _context3["catch"](3);

                            console.log(_context3.t0.stack);
                            console.log(_context3.t0.lineNumber);
                            throw _context3.t0;

                        case 31:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[3, 26]]);
        }));

        function deleteRecommendation(_x7, _x8, _x9) {
            return _ref9.apply(this, arguments);
        }

        return deleteRecommendation;
    }(),

    getRecommendations: function () {
        var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_, args, _ref10) {
            var user = _ref10.user;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            return _context4.abrupt("return", _Recommendation2.default.find({}));

                        case 3:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        }));

        function getRecommendations(_x10, _x11, _x12) {
            return _ref11.apply(this, arguments);
        }

        return getRecommendations;
    }()

};
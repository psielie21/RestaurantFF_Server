"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Restaurant = require("../../models/Restaurant");

var _Restaurant2 = _interopRequireDefault(_Restaurant);

var _auth = require("../../services/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    addRestaurant: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, _ref, _ref2) {
            var coords = _ref.coords,
                rest = _objectWithoutProperties(_ref, ["coords"]);

            var user = _ref2.user;
            var lat, lon, r;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            lat = void 0, lon = void 0;
                            _context.prev = 3;

                            //location should come in as an array of strings
                            lon = parseFloat(coords.split(",")[0]);
                            lat = parseFloat(coords.split(",")[1]);
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](3);
                            throw new Error("Invalid location format!");

                        case 11:
                            _context.prev = 11;
                            _context.next = 14;
                            return _Restaurant2.default.create(_extends({ location: { type: "Point", coordinates: [lon, lat] } }, rest));

                        case 14:
                            r = _context.sent;
                            return _context.abrupt("return", r);

                        case 18:
                            _context.prev = 18;
                            _context.t1 = _context["catch"](11);
                            throw _context.t1;

                        case 21:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[3, 8], [11, 18]]);
        }));

        function addRestaurant(_x, _x2, _x3) {
            return _ref3.apply(this, arguments);
        }

        return addRestaurant;
    }(),

    getRestaurants: function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, _ref4, _ref5) {
            var coords = _ref4.coords,
                name = _ref4.name;
            var user = _ref5.user;
            var lat, lon, rests;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            if (!coords) {
                                _context2.next = 19;
                                break;
                            }

                            lat = void 0, lon = void 0;
                            _context2.prev = 4;

                            //location should come in as an array of strings
                            lon = parseFloat(coords.split(",")[0]);
                            lat = parseFloat(coords.split(",")[1]);
                            _context2.next = 12;
                            break;

                        case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2["catch"](4);
                            throw new Error("Invalid location format!");

                        case 12:
                            _context2.next = 14;
                            return _Restaurant2.default.find({
                                location: {
                                    $nearSphere: {
                                        $geometry: {
                                            type: "Point",
                                            coordinates: [lon, lat]
                                        },
                                        $maxDistance: 100
                                    }
                                }
                            });

                        case 14:
                            rests = _context2.sent;


                            if (rests.length == 0) {
                                //insert external api here
                            }

                            return _context2.abrupt("return", rests);

                        case 19:
                            if (!name) {
                                _context2.next = 23;
                                break;
                            }

                            return _context2.abrupt("return", _Restaurant2.default.find({
                                "name": { $regex: ".*" + name + ".*" }
                            }));

                        case 23:
                            throw new Error("Both args undefined!");

                        case 24:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[4, 9]]);
        }));

        function getRestaurants(_x4, _x5, _x6) {
            return _ref6.apply(this, arguments);
        }

        return getRestaurants;
    }()
};
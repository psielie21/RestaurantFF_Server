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
                body = _ref.body;
            var user = _ref2.user;
            var found, rec, me, recs;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _Restaurant2.default.findById({ _id: restaurant });

                        case 3:
                            found = _context.sent;

                            if (!found) {
                                _context.next = 16;
                                break;
                            }

                            _context.next = 7;
                            return _Recommendation2.default.create({ body: body, author: user._id, restaurant: restaurant });

                        case 7:
                            rec = _context.sent;
                            _context.next = 10;
                            return (0, _auth.requireAuth)(user);

                        case 10:
                            me = _context.sent;
                            recs = me.recs;
                            _context.next = 14;
                            return recs.push(rec);

                        case 14:
                            _User2.default.findOneAndUpdate({ _id: user._id }, { recs: recs }, function (err, res) {
                                if (err) console.error(err);
                                //console.log(res);
                            });
                            return _context.abrupt("return", rec);

                        case 16:
                            throw new Error("Restaurant could not be found!");

                        case 19:
                            _context.prev = 19;
                            _context.t0 = _context["catch"](0);
                            throw _context.t0;

                        case 22:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 19]]);
        }));

        function createRecommendation(_x, _x2, _x3) {
            return _ref3.apply(this, arguments);
        }

        return createRecommendation;
    }(),

    getRecommendations: function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, args, _ref4) {
            var user = _ref4.user;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            return _context2.abrupt("return", _Recommendation2.default.find({}));

                        case 4:
                            _context2.prev = 4;
                            _context2.t0 = _context2["catch"](0);
                            throw _context2.t0;

                        case 7:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[0, 4]]);
        }));

        function getRecommendations(_x4, _x5, _x6) {
            return _ref5.apply(this, arguments);
        }

        return getRecommendations;
    }(),

    deleteRecommendation: function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_, _ref6, _ref7) {
            var _id = _ref6._id;
            var user = _ref7.user;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            return _context3.abrupt("return", _Recommendation2.default.deleteOne({ _id: _id }));

                        case 4:
                            _context3.prev = 4;
                            _context3.t0 = _context3["catch"](0);
                            throw _context3.t0;

                        case 7:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[0, 4]]);
        }));

        function deleteRecommendation(_x7, _x8, _x9) {
            return _ref8.apply(this, arguments);
        }

        return deleteRecommendation;
    }(),

    getRestaurants: function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_, _ref9, user) {
            var location = _ref9.location;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        }));

        function getRestaurants(_x10, _x11, _x12) {
            return _ref10.apply(this, arguments);
        }

        return getRestaurants;
    }(),

    getNearbyRecommendations: function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_, _ref11, user) {
            var location = _ref11.location;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined);
        }));

        function getNearbyRecommendations(_x13, _x14, _x15) {
            return _ref12.apply(this, arguments);
        }

        return getNearbyRecommendations;
    }()
};
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decodeToken = exports.requireAuth = undefined;

var requireAuth = exports.requireAuth = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
        var me;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(!user || !user._id)) {
                            _context.next = 2;
                            break;
                        }

                        throw new Error("Unauthorized");

                    case 2:
                        _context.next = 4;
                        return _User2.default.findById(user._id);

                    case 4:
                        me = _context.sent;

                        console.log(me);

                        if (me) {
                            _context.next = 8;
                            break;
                        }

                        throw new Error("Unathorized");

                    case 8:
                        return _context.abrupt("return", me);

                    case 9:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function requireAuth(_x) {
        return _ref.apply(this, arguments);
    };
}();

var decodeToken = exports.decodeToken = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(token) {
        var arr;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        arr = token.split(" ");

                        if (!(arr[0] == "Bearer")) {
                            _context2.next = 4;
                            break;
                        }

                        return _context2.abrupt("return", _jsonwebtoken2.default.verify(arr[1], _constants2.default.JWT_SECRET));

                    case 4:
                        _context2.next = 9;
                        break;

                    case 6:
                        _context2.prev = 6;
                        _context2.t0 = _context2["catch"](0);
                        throw _context2.t0;

                    case 9:
                        throw new Error("Token not valid!");

                    case 10:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 6]]);
    }));

    return function decodeToken(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _constants = require("../config/constants");

var _constants2 = _interopRequireDefault(_constants);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
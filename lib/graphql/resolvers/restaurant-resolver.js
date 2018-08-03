"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Restaurant = require("../../models/Restaurant");

var _Restaurant2 = _interopRequireDefault(_Restaurant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    addRestaurant: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, _ref, _ref2) {
            var rest = _objectWithoutProperties(_ref, []);

            var user = _ref2.user;
            var r;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _Restaurant2.default.create(_extends({}, rest));

                        case 3:
                            r = _context.sent;
                            return _context.abrupt("return", r);

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context["catch"](0);
                            throw _context.t0;

                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 7]]);
        }));

        function addRestaurant(_x, _x2, _x3) {
            return _ref3.apply(this, arguments);
        }

        return addRestaurant;
    }()
};
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requireAuth = undefined;

var requireAuth = exports.requireAuth = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
        var me;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log(user);

                        if (!(!user || !user._id)) {
                            _context.next = 3;
                            break;
                        }

                        throw new Error("Unauthorized");

                    case 3:
                        me = _User2.default.findById(user._id);

                        if (me) {
                            _context.next = 6;
                            break;
                        }

                        throw new Error("Unathorized");

                    case 6:
                        return _context.abrupt("return", me);

                    case 7:
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

/*
deprecated - using express-jwt now
export async function decodeToken(token){
    const arr = token.split(" ");
    
    if(arr[0] == "Bearer"){
        return(jwt.verify(arr[1], constants.JWT_SECRET));
    }
    
    throw new Error("Token not valid!") 
}

*/


var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _constants = require("../config/constants");

var _constants2 = _interopRequireDefault(_constants);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
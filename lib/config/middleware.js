"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var auth = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var token, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            token = req.headers.authorization;

            if (!(token != null)) {
              _context.next = 11;
              break;
            }

            console.log("Auth process about to start");
            _context.next = 6;
            return (0, _auth.decodeToken)(token);

          case 6:
            user = _context.sent;

            console.log("Auth process finished");
            req.user = user;
            _context.next = 13;
            break;

          case 11:
            req.user = null;
            console.log("User is null");

          case 13:
            return _context.abrupt("return", next());

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);

            req.user = null;
            console.log("User is null");
            return _context.abrupt("return", next());

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 16]]);
  }));

  return function auth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressJwt = require("express-jwt");

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _constants = require("./constants");

var _constants2 = _interopRequireDefault(_constants);

var _auth = require("../services/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (app) {
  app.use(_bodyParser2.default.json());
  app.use(auth);
};
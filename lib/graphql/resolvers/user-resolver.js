"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _User = require("../../models/User");

var _User2 = _interopRequireDefault(_User);

var _auth = require("../../services/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    signup: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, _ref) {
            var rest = _objectWithoutProperties(_ref, []);

            var user;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _User2.default.create(_extends({}, rest));

                        case 3:
                            user = _context.sent;
                            return _context.abrupt("return", {
                                token: user.createToken()
                            });

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

        function signup(_x, _x2) {
            return _ref2.apply(this, arguments);
        }

        return signup;
    }(),

    login: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, _ref3) {
            var emailOrUser = _ref3.emailOrUser,
                password = _ref3.password;
            var user;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            user = void 0;

                            if (!(emailOrUser.indexOf("@") > -1)) {
                                _context2.next = 8;
                                break;
                            }

                            _context2.next = 5;
                            return _User2.default.findOne({ email: emailOrUser });

                        case 5:
                            user = _context2.sent;
                            _context2.next = 11;
                            break;

                        case 8:
                            _context2.next = 10;
                            return _User2.default.findOne({ username: emailOrUser });

                        case 10:
                            user = _context2.sent;

                        case 11:
                            if (user) {
                                _context2.next = 13;
                                break;
                            }

                            throw new Error("User not exist!");

                        case 13:
                            if (user.authenticateUser(password)) {
                                _context2.next = 15;
                                break;
                            }

                            throw new Error("Password not match!");

                        case 15:
                            return _context2.abrupt("return", {
                                token: user.createToken()
                            });

                        case 18:
                            _context2.prev = 18;
                            _context2.t0 = _context2["catch"](0);
                            throw _context2.t0;

                        case 21:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[0, 18]]);
        }));

        function login(_x3, _x4) {
            return _ref4.apply(this, arguments);
        }

        return login;
    }(),

    me: function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_, args, _ref5) {
            var user = _ref5.user;

            var _me;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return (0, _auth.requireAuth)(user);

                        case 3:
                            _me = _context3.sent;
                            return _context3.abrupt("return", _me);

                        case 7:
                            _context3.prev = 7;
                            _context3.t0 = _context3["catch"](0);
                            throw _context3.t0;

                        case 10:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[0, 7]]);
        }));

        function me(_x5, _x6, _x7) {
            return _ref6.apply(this, arguments);
        }

        return me;
    }(),

    //it is required that one of them is not null
    userProfile: function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_, _ref7, _ref8) {
            var email = _ref7.email,
                username = _ref7.username;
            var user = _ref8.user;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            _context4.prev = 2;

                            if (!email) {
                                _context4.next = 7;
                                break;
                            }

                            return _context4.abrupt("return", _User2.default.findOne({ email: email }));

                        case 7:
                            return _context4.abrupt("return", _User2.default.findOne({ username: username }));

                        case 8:
                            _context4.next = 13;
                            break;

                        case 10:
                            _context4.prev = 10;
                            _context4.t0 = _context4["catch"](2);
                            throw _context4.t0;

                        case 13:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[2, 10]]);
        }));

        function userProfile(_x8, _x9, _x10) {
            return _ref9.apply(this, arguments);
        }

        return userProfile;
    }(),

    users: function () {
        var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_, args, _ref10) {
            var user = _ref10.user;

            var _users;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            _context5.prev = 2;
                            _users = _User2.default.find({});
                            return _context5.abrupt("return", _users);

                        case 7:
                            _context5.prev = 7;
                            _context5.t0 = _context5["catch"](2);
                            throw _context5.t0;

                        case 10:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined, [[2, 7]]);
        }));

        function users(_x11, _x12, _x13) {
            return _ref11.apply(this, arguments);
        }

        return users;
    }()

};
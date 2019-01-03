"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _User = require("../../models/User");

var _User2 = _interopRequireDefault(_User);

var _auth = require("../../services/auth");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _shortid = require("shortid");

var _shortid2 = _interopRequireDefault(_shortid);

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

    updateMe: function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_, _ref10, _ref11) {
            var profilePicture = _ref10.profilePicture;
            var user = _ref11.user;

            var me, _ref13, filename, mimetype, stream, _ref14, id, path, pathInDb, newMe;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            me = _context5.sent;
                            _context5.prev = 3;
                            _context5.next = 6;
                            return profilePicture;

                        case 6:
                            _ref13 = _context5.sent;
                            filename = _ref13.filename;
                            mimetype = _ref13.mimetype;
                            stream = _ref13.stream;
                            _context5.next = 12;
                            return storeUpload(stream, me.username);

                        case 12:
                            _ref14 = _context5.sent;
                            id = _ref14.id;
                            path = _ref14.path;

                            console.log(path);
                            pathInDb = "https://restaurant-ff-server-psielie.c9users.io/" + path;
                            _context5.next = 19;
                            return _User2.default.findOneAndUpdate({ _id: me._id }, { avatar: pathInDb });

                        case 19:
                            newMe = _context5.sent;

                            console.log(newMe);
                            return _context5.abrupt("return", newMe);

                        case 24:
                            _context5.prev = 24;
                            _context5.t0 = _context5["catch"](3);

                            console.log(_context5.t0);
                            throw _context5.t0;

                        case 28:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined, [[3, 24]]);
        }));

        function updateMe(_x11, _x12, _x13) {
            return _ref12.apply(this, arguments);
        }

        return updateMe;
    }(),

    users: function () {
        var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_, args, _ref15) {
            var user = _ref15.user;

            var _users;

            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return (0, _auth.requireAuth)(user);

                        case 2:
                            _context6.prev = 2;
                            _users = _User2.default.find({});
                            return _context6.abrupt("return", _users);

                        case 7:
                            _context6.prev = 7;
                            _context6.t0 = _context6["catch"](2);
                            throw _context6.t0;

                        case 10:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined, [[2, 7]]);
        }));

        function users(_x14, _x15, _x16) {
            return _ref16.apply(this, arguments);
        }

        return users;
    }()
};


var storeUpload = function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(stream, username) {
        var id, path;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.prev = 0;

                        _fs2.default.mkdirSync("static/" + username);
                        _context7.next = 8;
                        break;

                    case 4:
                        _context7.prev = 4;
                        _context7.t0 = _context7["catch"](0);

                        if (!(_context7.t0.code !== 'EEXIST')) {
                            _context7.next = 8;
                            break;
                        }

                        throw _context7.t0;

                    case 8:
                        id = _shortid2.default.generate();
                        path = "static/" + username + "/" + id + ".jpg";
                        return _context7.abrupt("return", new Promise(function (resolve, reject) {
                            return stream.pipe((0, _fs.createWriteStream)(path)).on('finish', function () {
                                return resolve({ id: id, path: path });
                            }).on('error', reject);
                        }));

                    case 11:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, undefined, [[0, 4]]);
    }));

    return function storeUpload(_x17, _x18) {
        return _ref17.apply(this, arguments);
    };
}();
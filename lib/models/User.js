"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptNodejs = require("bcrypt-nodejs");

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _constants = require("../config/constants");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = _mongoose2.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    avatar: String,
    recs: [{
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'Recommendation'
    }]

}, { timestamps: true });

UserSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = this._hashPassword(this.password);
        return next();
    }
    return next();
});

UserSchema.methods = {
    _hashPassword: function _hashPassword(password) {
        return (0, _bcryptNodejs.hashSync)(password);
    },
    authenticateUser: function authenticateUser(pwd) {
        return (0, _bcryptNodejs.compareSync)(pwd, this.password);
    },
    createToken: function createToken() {
        return _jsonwebtoken2.default.sign({ _id: this._id }, _constants2.default.JWT_SECRET);
    }
};

exports.default = _mongoose2.default.model("User", UserSchema);
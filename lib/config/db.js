"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = require("./constants");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect(_constants2.default.DB_URL);
_mongoose2.default.connection.once("open", function () {
    return console.log("Running");
}).on("error", console.error.bind(console, 'connection error:'));
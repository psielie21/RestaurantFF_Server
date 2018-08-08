"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  PORT: process.env.PORT || 8080,
  DB_URL: "mongodb://localhost:27017/rffserver",
  GRAPHQL_PATH: "/graphql",
  JWT_SECRET: "thisisasecret"
};
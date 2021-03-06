'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlDate = require('graphql-date');

var _graphqlDate2 = _interopRequireDefault(_graphqlDate);

var _graphqlUpload = require('graphql-upload');

var _userResolver = require('./user-resolver');

var _userResolver2 = _interopRequireDefault(_userResolver);

var _recommendationResolver = require('./recommendation-resolver');

var _recommendationResolver2 = _interopRequireDefault(_recommendationResolver);

var _restaurantResolver = require('./restaurant-resolver');

var _restaurantResolver2 = _interopRequireDefault(_restaurantResolver);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _Restaurant = require('../../models/Restaurant');

var _Restaurant2 = _interopRequireDefault(_Restaurant);

var _Recommendation = require('../../models/Recommendation');

var _Recommendation2 = _interopRequireDefault(_Recommendation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  Date: _graphqlDate2.default,
  //Upload: GraphQLUpload,
  Recommendation: {
    author: function author(_ref) {
      var _author = _ref.author;
      return _User2.default.findById(_author);
    },
    restaurant: function restaurant(_ref2) {
      var _restaurant = _ref2.restaurant;
      return _Restaurant2.default.findById(_restaurant);
    }
  },
  Restaurant: {

    location: function location(_ref3) {
      var _location = _ref3.location;

      return {
        latitude: _location.coordinates[1],
        longitude: _location.coordinates[0]
      };
    },
    recommendations: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
        var _recommendations = _ref4.recommendations;
        var results;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _Recommendation2.default.find({
                  '_id': { $in: _recommendations }
                });

              case 2:
                results = _context.sent;
                return _context.abrupt('return', results);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function recommendations(_x) {
        return _ref5.apply(this, arguments);
      }

      return recommendations;
    }()

  },
  User: {
    recs: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref6) {
        var _recs = _ref6.recs;
        var results;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _Recommendation2.default.find({
                  '_id': { $in: _recs }
                });

              case 2:
                results = _context2.sent;
                return _context2.abrupt('return', results);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      function recs(_x2) {
        return _ref7.apply(this, arguments);
      }

      return recs;
    }()
  },
  Query: {
    me: _userResolver2.default.me,
    userProfile: _userResolver2.default.userProfile,
    users: _userResolver2.default.users,
    getNearbyRecommendations: _recommendationResolver2.default.getNearbyRecommendations,
    getRestaurants: _restaurantResolver2.default.getRestaurants,
    getRecommendations: _recommendationResolver2.default.getRecommendations,
    getLocationBasedRestaurants: _restaurantResolver2.default.getLocationBasedRestaurants,
    getBoxBasedRestaurants: _restaurantResolver2.default.getBoxBasedRestaurants

  },
  Mutation: {
    signup: _userResolver2.default.signup,
    login: _userResolver2.default.login,
    createRecommendation: _recommendationResolver2.default.createRecommendation,
    deleteRecommendation: _recommendationResolver2.default.deleteRecommendation,
    addRestaurant: _restaurantResolver2.default.addRestaurant,
    updateMe: _userResolver2.default.updateMe
  }
};
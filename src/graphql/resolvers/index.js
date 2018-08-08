import GraphQLDate from 'graphql-date';

import UserResolver from './user-resolver';
import RecommendationResolver from "./recommendation-resolver"
import RestaurantResolver from "./restaurant-resolver";

import User from '../../models/User';
import Restaurant from "../../models/Restaurant";
import Recommendation from "../../models/Recommendation";

export default {
  Date: GraphQLDate,
  Recommendation: {
    author: ({author}) => User.findById(author),
    restaurant: ({restaurant}) => Restaurant.findById(restaurant)
  },
  Restaurant: {
    /*
    coords: ({coords}) => {
      return {
              lat: coords[0].split(", ")[0],
              lon: coords[0].split(", ")[1],
             }
    }
    */
  },
  User: {
    recs: async ({recs}) =>  {
      const results = await Recommendation.find({
       '_id': { $in: recs }
      })
      return results;

    },
  },
  Query: {
    me: UserResolver.me,
    userProfile: UserResolver.userProfile,
    users: UserResolver.users,
    getRecommendations: RecommendationResolver.getRecommendations,
    getRestaurants: RestaurantResolver.getRestaurants,
    
  },
  Mutation: {
    signup: UserResolver.signup,
    login: UserResolver.login,
    createRecommendation: RecommendationResolver.createRecommendation,
    deleteRecommendation: RecommendationResolver.deleteRecommendation,
    deleteUsers: UserResolver.deleteUsers,
    addRestaurant: RestaurantResolver.addRestaurant,
  },
};
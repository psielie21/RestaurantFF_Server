"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = "\n    scalar Date\n    \n    type Auth {\n        token: String!\n    }\n    \n    type Location {\n        lat: String!\n        lon: String!\n    }\n    \n    type User {\n        _id: ID!\n        username: String!\n        email: String!\n        firstName: String\n        lastName: String\n        avatar: String\n        recs: [Recommendation]\n        createdAt: Date!\n        updatedAt: Date!\n    }\n    \n    type Restaurant {\n        _id: ID!\n        name: String!\n        coords: Location!\n        thirdPartyId: String\n        website: String\n        type: String\n        phone: String\n    }\n    \n    type Recommendation {\n        _id: ID!\n        author: User\n        body: String\n        restaurant: Restaurant\n        pictures: [String]\n        createdAt: Date!\n        updatedAt: Date!\n    }\n    \n    type Query {\n        me: User\n        userProfile(email: String, username: String): User\n        users: [User]\n        getNearbyRecommendations(loc: String!): [Recommendation]\n        getRestaurants(loc: String!): [Restaurant]\n        \n        getRecommendations: [Recommendation]\n    }\n    \n    type Mutation {\n        login(email: String!, password: String!): Auth\n        signup(username: String!, password: String!, firstName: String, lastName: String, email: String!, avatar: String): Auth\n        createRecommendation(restaurant: ID, body: String, pictures: [String]): Recommendation \n        addRestaurant(name: String!, coords: String!, website: String, type: String, phone: String, country: String, adress: String, city: String, zip: String): Restaurant\n        deleteRecommendation(_id: ID): String\n        \n        deleteUsers: [User]\n    }\n    \n    schema {\n        query: Query\n        mutation: Mutation\n    }\n    \n";
export default`
    scalar Date
    
    type Auth {
        token: String!
    }
    
    type Location {
        lat: String!
        lon: String!
    }
    
    type User {
        _id: ID!
        username: String!
        email: String!
        firstName: String
        lastName: String
        avatar: String
        recs: [Recommendation]
        createdAt: Date!
        updatedAt: Date!
    }
    
    type Restaurant {
        _id: ID!
        name: String!
        coords: Location!
        thirdPartyId: String
        website: String
        type: String
        phone: String
    }
    
    type Recommendation {
        _id: ID!
        author: User
        body: String
        restaurant: Restaurant
        pictures: [String]
        createdAt: Date!
        updatedAt: Date!
    }
    
    type Query {
        me: User
        userProfile(email: String, username: String): User
        users: [User]
        getNearbyRecommendations(loc: String!): [Recommendation]
        getRestaurants(loc: String!): [Restaurant]
        
        getRecommendations: [Recommendation]
    }
    
    type Mutation {
        login(email: String!, password: String!): Auth
        signup(username: String!, password: String!, firstName: String, lastName: String, email: String!, avatar: String): Auth
        createRecommendation(restaurant: ID, body: String, pictures: [String]): Recommendation 
        addRestaurant(name: String!, coords: String!, website: String, type: String, phone: String, country: String, adress: String, city: String, zip: String): Restaurant
        deleteRecommendation(_id: ID): String
        
        deleteUsers: [User]
    }
    
    schema {
        query: Query
        mutation: Mutation
    }
    
`
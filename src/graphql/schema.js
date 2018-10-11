export default`
    scalar Date

    type Auth {
        token: String!
    }
    
    type Image {
        data: String
        contentType: String
    }
    
    type Location {
        latitude: Float!
        longitude: Float!
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
        location: Location!
        recommendations: [Recommendation]
        apiId: String
        website: String
        type: String
        phone: String
        country: String
        adress: String
        city: String
        zip: String
        confirmed: Boolean
        confirmationCount: Int
        
    }
    
    type Recommendation {
        _id: ID!
        author: User
        body: String
        restaurant: Restaurant
        pictures: [String]
        createdAt: Date!
        updatedAt: Date!
        rating: Int
    }
    
    type Query {
        me: User
        userProfile(email: String, username: String): User
        users: [User]
        getNearbyRecommendations(coords: String, distance: Float): [Restaurant]
        getRestaurants(coords: String, name: String): [Restaurant]
        getLocationBasedRestaurants(coords: String): [Restaurant]
        getBoxBasedRestaurants(lat1: Float, lon1: Float, lat2: Float, lon2: Float) : [Restaurant]
        getRecommendations: [Recommendation]
    }
    
    type Mutation {
        login(emailOrUser: String!, password: String!): Auth
        signup(username: String!, password: String!, firstName: String, lastName: String, email: String!): Auth
        createRecommendation(restaurant: ID, body: String, rating: Int!, pictures: [String], restName: String, latitude: Float, longitude: Float ): Recommendation 
        addRestaurant(name: String!, coords: String, website: String, type: String, phone: String, country: String, adress: String, city: String, zip: String, body: String!, rating: Int!,): Restaurant
        deleteRecommendation(_id: ID): Recommendation
        updateMe(profilePicture: Upload): User
        
    }
    
    schema {
        query: Query
        mutation: Mutation
    }
    
`
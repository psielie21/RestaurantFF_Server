const expect = require("chai").expect,
    supertest = require("supertest"),
    api=supertest("https://restaurant-ff-server-psielie.c9users.io/graphql");
    
const Recommendation = require("../lib/models/Recommendation");
const User = require("../lib/models/User");
const Restaurant = require("../lib/models/Restaurant");
const constants = require("../lib/config/constants");
const mongoose = require("mongoose");

const testUsers = require("./data/test_data").testUsers;
const testRecommendations = require("./data/test_data").testRecommendations;
const testRestaurants = require("./data/test_data").testRestaurants;


describe("Recommendation", function(){
    let token, id, rec_id, latitude, longitude, name, length;
    before(function(done){
        mongoose.connect(constants.default.DB_URL, {useNewUrlParser: true });
        mongoose.connection.collections['recommendations'].remove({}, function(err) {
            mongoose.connection.collections['users'].remove({}, function(err) {
                mongoose.connection.collections['restaurants'].remove({}, function(err) {
                done();
                });
            });
        });
    });
    
    it('should return a 200 response', function (done) {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    "query": "{me{username}}"
                })
                .expect(200, done);
        });

        
    it("should create a dummy user", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .send({
                "query": "mutation{signup("+ _stringify(testUsers.user2) +"){token}}"
                
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.a("null");
                token = res.body.data.signup.token;
                expect(token).to.be.a("string");
                expect(token.length).to.equal(149);
                done();
            });
    });
    
    it("should have created a valid user", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query{ me{ username firstName lastName email createdAt}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.be.a("null");
                expect(res.body.data.me.username).to.equal(testUsers.user2.username);
                expect(res.body.data.me.firstName).to.equal(testUsers.user2.firstName);
                expect(res.body.data.me.lastName).to.equal(testUsers.user2.lastName);
                expect(res.body.data.me.email).to.equal(testUsers.user2.email);
                done();
            });
    });
    
    
    it("should let the user query nearby restaurants", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query{getRestaurants(coords: \""+ testRestaurants.restaurant3.coords +"\"){name city zip country _id location {latitude longitude} } }"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.errors).to.equal(undefined);
                id = res.body.data.getRestaurants[0]._id;
                latitude = res.body.data.getRestaurants[0].location.latitude;
                longitude = res.body.data.getRestaurants[0].location.longitude;
                name = res.body.data.getRestaurants[0].name;
                length = res.body.data.getRestaurants.length;
                done();
            });
    });
    
    it("should let the user create a recommendation", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "mutation {createRecommendation(restaurant: \""+ id +"\", body: \""+ testRecommendations.recommendation1.body +"\", rating: " + testRecommendations.recommendation1.rating +", restName: \""+ name +"\", latitude: "+ latitude +", longitude: " + longitude +"){_id author {username} restaurant {name} body }}"
            })
            .expect(200)
            .end(function(err, res){
                //expect(res.body.errors[0].message).to.equal(undefined);
                expect(err).to.equal(null);
                rec_id = res.body.data.createRecommendation._id;
                expect(res.body.data.createRecommendation.author.username).to.equal(testUsers.user2.username);
                expect(res.body.data.createRecommendation.body).to.equal(testRecommendations.recommendation1.body);     
                done();
            });
    });
    
    it("should have added the recs in the user records", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query {me{ recs {_id body restaurant {name}}}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.me.recs.length).to.equal(1);
                expect(res.body.data.me.recs[0].body).to.equal(testRecommendations.recommendation1.body);
                done();
            });
    });
    
    it("should query all the nearby recommendations", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query {getNearbyRecommendations(coords: \""+ longitude + ", " + latitude +"\", distance: 100){_id name adress zip recommendations{_id body }}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.getNearbyRecommendations.length).to.equal(1);
                done();
            });
    });
    
    it("should show the user all nearby restaurants but NOT include his added restaurant twice", function(done) {
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "{getRestaurants(coords: \""+ testRestaurants.restaurant3.coords +"\") {_id name}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants.length).to.equal(length);
                done();
            });
    })
    
    it("should let the user delete the recommendation", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "mutation {deleteRecommendation(_id: \""+ rec_id +"\"){body }}"
            })
            .expect(200)
            .end(function(err, res){
                //expect(res.body.errors[0].message).to.equal(undefined);
                expect(err).to.equal(null);
                expect(res.body.data.deleteRecommendation.body).to.equal(testRecommendations.recommendation1.body);
                done();
            });
    });
    
    it("should find no nearby recommendations", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query {getNearbyRecommendations(coords: \""+ testRestaurants.restaurant3.coords +"\", distance: 100){_id name adress zip recommendations{ _id }}}"
            })
            .expect(200)
            .end(function(err, res){
                //expect(res.body.data.errors[0]).to.equal(undefined);
                expect(err).to.equal(null);
                expect(res.body.data.getNearbyRecommendations.length).to.equal(0);

                done();
            });
    });
    
    it("should have removed the recommendation in the user record", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query{ me{ recs {_id} }}"
            })
            .expect(200)
            .end(function(err, res){
                //expect(res.body.data.errors[0]).to.equal(undefined);
                expect(err).to.equal(null);
                expect(res.body.data.me.recs.length).to.equal(0);

                done();
            });
    });
    
    
    after(function(done){
        mongoose.connection.collections['recommendations'].remove({}, function(err) {
            mongoose.connection.collections['users'].remove({}, function(err) {
                mongoose.connection.collections['restaurants'].remove({}, function(err) {
                    mongoose.connection.close();
                    done();
                });
            });
        });
    });
    
});

let _stringify = function(obj){
    return JSON.stringify(obj).slice(1,-1).replace(/\"([^(\")"]+)\":/g,"$1:");
};
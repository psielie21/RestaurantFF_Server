const expect = require("chai").expect,
    supertest = require("supertest"),
    api=supertest("https://restaurant-ff-server-psielie.c9users.io/graphql");
    
const Recommendation = require("../lib/models/Recommendation");
const constants = require("../lib/config/constants");
const mongoose = require("mongoose");
const testObj = require("./data/test_data").testObj;

describe("Recommendation", function(){
    let token, id, rec_id;
    before(function(done){
        mongoose.connect(constants.default.DB_URL, {useNewUrlParser: true });
            mongoose.connection.collections['recommendations'].remove({}, function(err) {
                mongoose.connection.close();
                done();
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
                "query": "mutation{signup("+ _stringify(testObj.user2) +"){token}}"
                
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
                expect(res.body.data.me.username).to.equal(testObj.user2.username);
                expect(res.body.data.me.firstName).to.equal(testObj.user2.firstName);
                expect(res.body.data.me.lastName).to.equal(testObj.user2.lastName);
                expect(res.body.data.me.email).to.equal(testObj.user2.email);
                done();
            });
    });
    
    it("should let the user query nearby restaurants", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query{getRestaurants(coords: \""+ testObj.restaurant3.coords +"\"){name city zip country _id} }"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant3.name);
                expect(res.body.data.getRestaurants[0].city).to.equal(testObj.restaurant3.city);
                expect(res.body.data.getRestaurants[0].zip).to.equal(testObj.restaurant3.zip);     
                expect(res.body.data.getRestaurants[0].country).to.equal(testObj.restaurant3.country);
                
                id = res.body.data.getRestaurants[0]._id;
                done();
            });
    });
    
    it("should let the user create a recommendation", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "mutation {createRecommendation(restaurant: \""+ id +"\", body: \""+ testObj.recommendation1.body +"\"){author {username} restaurant {name} body }}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.createRecommendation.author.username).to.equal(testObj.user2.username);
                expect(res.body.data.createRecommendation.restaurant.name).to.equal(testObj.restaurant3.name);
                expect(res.body.data.createRecommendation.body).to.equal(testObj.recommendation1.body);     
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
                expect(res.body.data.me.recs[0].body).to.equal(testObj.recommendation1.body);
                expect(res.body.data.me.recs[0].restaurant.name).to.equal(testObj.restaurant3.name);
                done();
            });
    });
    
    it("should query all the nearby recommendations", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query {getNearbyRecommendations(coords: \""+ testObj.restaurant3.coords +"\", distance: 100){_id body restaurant{name adress zip}}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.getNearbyRecommendations.length).to.equal(1);
                expect(res.body.data.getNearbyRecommendations[0].body).to.equal(testObj.recommendation1.body);
                expect(res.body.data.getNearbyRecommendations[0].restaurant.name).to.equal(testObj.restaurant3.name);
                expect(res.body.data.getNearbyRecommendations[0].restaurant.adress).to.equal(testObj.restaurant3.adress);
                expect(res.body.data.getNearbyRecommendations[0].restaurant.zip).to.equal(testObj.restaurant3.zip);
                
                rec_id = res.body.data.getNearbyRecommendations[0]._id;

                done();
            });
    });
    
    it("should let the user delete the recommendation", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "mutation {deleteRecommendation(_id: \""+ rec_id +"\"){body }}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.deleteRecommendation.body).to.equal(null);
                done();
            });
    });
    
    it("should find no nearby recommendations", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query {getNearbyRecommendations(coords: \""+ testObj.restaurant3.coords +"\", distance: 100){_id body restaurant{name adress zip}}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.getNearbyRecommendations.length).to.equal(0);

                done();
            });
    });
    
});

let _stringify = function(obj){
    return JSON.stringify(obj).slice(1,-1).replace(/\"([^(\")"]+)\":/g,"$1:");
};
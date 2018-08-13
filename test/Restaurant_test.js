const expect = require("chai").expect,
    supertest = require("supertest"),
    api=supertest("https://restaurant-ff-server-psielie.c9users.io/graphql");
    
const Restaurant = require("../lib/models/Restaurant");
const constants = require("../lib/config/constants");
const mongoose = require("mongoose");
const testObj = require("./data/test_data").testObj;

describe("Restaurant", function(){
    let token;
    before(function(done){
        mongoose.connect(constants.default.DB_URL, {useNewUrlParser: true });
            mongoose.connection.collections['restaurants'].remove({}, function(err) {
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
                //"query": "mutation{signup(username: \"rest_tester\", password: \"pass\", firstName: \"Testo\", lastName: \"First\", email:\"test1@gmail.com\") {token}}"
                "query": "mutation{signup("+ _stringify(testObj.user1) +"){token}}"
                
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
                expect(res.body.data.me.username).to.equal(testObj.user1.username);
                expect(res.body.data.me.firstName).to.equal(testObj.user1.firstName);
                expect(res.body.data.me.lastName).to.equal(testObj.user1.lastName);
                expect(res.body.data.me.email).to.equal(testObj.user1.email);
                done();
            });
    });
    
    it("should let the user add a restaurant", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "mutation{ addRestaurant(" + _stringify(testObj.restaurant1) + "){name website phone country adress city zip}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.addRestaurant.name).to.equal(testObj.restaurant1.name);
                done();
            });
    });
    
    it("only authorized users!", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .send({
                "query": "mutation{ addRestaurant(" + _stringify(testObj.restaurant1) + "){name }}"
            })
            .expect(200)
            .end(function(err,res){
                expect(res.body.errors[0].message).to.be.a("string");
                done();
            });
    });
    
    it("should find the added restaurant", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.restaurant1.coords +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                done();
            });
    });
    
    it("should add some more restaurants", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "mutation{rest2: addRestaurant(" + _stringify(testObj.restaurant2) + "){name }, rest3: addRestaurant(" + _stringify(testObj.restaurant3) + "){name }, rest4: addRestaurant(" + _stringify(testObj.restaurant4) + "){name }, rest5: addRestaurant(" + _stringify(testObj.restaurant5) + "){name }}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.rest2.name).to.equal(testObj.restaurant2.name);
                expect(res.body.data.rest3.name).to.equal(testObj.restaurant3.name);
                expect(res.body.data.rest4.name).to.equal(testObj.restaurant4.name);
                expect(res.body.data.rest5.name).to.equal(testObj.restaurant5.name);
                done();
            });
    });
    
    it("should find no restaurant", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.random_coords +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(0);
                done();
            });
    });
    
    it("should find exactly one restaurant 1/4", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.rest2_testing.c1 +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant2.name);
                done();
            });
    });
    
    it("should find exactly one restaurant 2/4", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.rest2_testing.c2 +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant2.name);
                done();
            });
    });
    
    it("should find exactly one restaurant 3/4", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.rest2_testing.c3 +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant2.name);
                done();
            });
    });
    
    it("should find exactly one restaurant 4/4", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.rest2_testing.c4 +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant2.name);
                done();
            });
    });
    
    it("should find restaurants by name", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(name: \""+ testObj.restaurant3.name +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant3.name);
                done();
            });
    });
    
    it("should find restaurants by partial name", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(name: \""+ testObj.restaurant3.name.substring(2) +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant3.name);
                done();
            });
    });
});

let _stringify = function(obj){
    return JSON.stringify(obj).slice(1,-1).replace(/\"([^(\")"]+)\":/g,"$1:");
};
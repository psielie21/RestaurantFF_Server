const expect = require("chai").expect,
    supertest = require("supertest"),
    api=supertest("https://restaurant-ff-server-psielie.c9users.io/graphql");
    
const Recommendation = require("../lib/models/Recommendation");
const User = require("../lib/models/User");
const Restaurant = require("../lib/models/Restaurant");
const constants = require("../lib/config/constants");
const mongoose = require("mongoose");
const testObj = require("./data/test_data").testObj;

describe("Restaurant", function(){
    let token;
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
    
    //this test is API dependent so we only require it to not throw an error
    it("should let the user query nearby restaurants", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "query{ getRestaurants(coords: \""+ _stringify(testObj.restaurant1.coords) + "\"){name website phone country adress city zip}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                done();
            });
    })
    
    it("should let the user add a restaurant when he cant find his restaurant", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .send({
                "query": "mutation{ addRestaurant(" + _stringify(testObj.restaurant1) + " " + _stringify(testObj.recommendation1) +"){name website phone country adress city zip}}"
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
    
    //this test is again API dependent as it could be that restaurant1 is already added to the db and already confirmed
    it("should find the added restaurant and be marked as unconfirmed", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.restaurant1.coords +"\") {name confirmed}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                const dataArr = res.body.data.getRestaurants;
                const target = dataArr.find(function(element){
                    return element.name == testObj.restaurant1.name;
                })
                expect(target.confirmed).to.be.false;
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
    
    
    it("should find restaurants by name", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(name: \""+ testObj.restaurant1.name +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.errors).to.equal(undefined);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant1.name);
                done();
            });
    });
    
    it("should find restaurants by partial name", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(name: \""+ testObj.restaurant1.name.substring(2) +"\") {name}}"
            })
            .expect(200)
            .end(function(err,res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                expect(res.body.data.getRestaurants.length).to.equal(1);
                expect(res.body.data.getRestaurants[0].name).to.equal(testObj.restaurant1.name);
                done();
            });
    });
    
    it("should find a predefined restaurant like 'Poinger Einkehr' ", function(done){
        api.post("/")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer "+token)
            .send({
                "query": "{getRestaurants(coords: \""+ testObj.poinger_einkehr_coords +"\") {name}}"
            })
            .expect(200)
            .end(function(err, res){
                expect(err).to.equal(null);
                expect(res.body.data.getRestaurants).to.be.an("array");
                const dataArr = res.body.data.getRestaurants;
                const target = dataArr.find(function(element){
                    return element.name == "Poinger Einkehr"
                })
                expect(target.name).to.equal("Poinger Einkehr");
                done();
            })
    })
    
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
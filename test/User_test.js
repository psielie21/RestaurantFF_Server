const should = require("chai").should(),
    expect = require("chai").expect,
    supertest = require("supertest"),
    api=supertest("https://restaurant-ff-server-psielie.c9users.io/graphql");
    
const User = require("../lib/models/User");
const constants = require("../lib/config/constants");
const mongoose = require("mongoose");

describe("User", function(){
    
    let validToken = "";
    let unvalidToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjY3NTllNTcxM2Q1YTFmOWQ1OTU0ZGEiLCJpYXQiOjE1MzM0OTk4Nzd9.ONgurjvwvxyPwsNk_oXsenm6KjsSKjxC_WYzc4kqg6m"
    before(function(done) {
            mongoose.connect(encodeURI(constants.default.DB_URL), {useNewUrlParser: true });
            mongoose.connection.collections['users'].drop( function(err) {
                mongoose.connection.close();
                done()
            });
            
        })
        
    describe("No auth token", function(){
        it('should return a 200 response', function (done) {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    "query": "{me{username}}"
                })
                .expect(200, done);
        });
        
        it('should return a "Unathorized" error message', function (done) {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    "query": "query{ users {username firstName lastName email createdAt	recs {_id author {username}	body}}}"
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body.data.users).to.equal(null);
                    expect(res.body.errors[0].message).to.equal("Unauthorized");
                    done();
                });
        });
    });
    
    describe("Unvalid auth token", function(){
        it('should return a 200 response', function (done) {
            api.post('/')
                .set('Accept', 'application/json')
                .set("Authorization", "Bearer " + unvalidToken)
                .send({
                    "query": "{me{username}}"
                })
                .expect(200, done);
        });
        
        it('should return a "Unathorized" error message', function (done) {
            api.post('/')
                .set('Accept', 'application/json')
                .set("Authorization", "Bearer " + unvalidToken)
                .send({
                    "query": "query{ users {username firstName lastName email createdAt	recs {_id author {username}	body}}}"
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body.data.users).to.equal(null);
                    expect(res.body.errors[0].message).to.equal("Unauthorized");
                    done();
                });
        });
    });
    
    describe("Valid auth token", function(){
        it("generates a valid user", function(done){
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    "query": "mutation{test1: signup(username: \"Test1\", password: \"pass\", firstName: \"Testo\", lastName: \"First\", email:\"test1@gmail.com\") {token}}"
                })
                .expect(200)
                .end(function(err,res){
                    expect(err).to.equal(null);
                    validToken = res.body.data.test1.token;
                    expect(validToken).to.be.a("string");
                    expect(validToken.length).to.equal(149);
                    done();
                });
        });
        
        it('should return a 200 response', function (done) {
            api.post('/')
                .set('Accept', 'application/json')
                .set("Authorization", "Bearer " + validToken)
                .send({
                    "query": "{me{username}}"
                })
                .expect(200, done);
        });
        
        it('should return all users', function (done) {
            api.post('/')
                .set('Accept', 'application/json')
                .set("Authorization", "Bearer " + validToken)
                .send({
                    "query": "query{ users {username firstName lastName email createdAt	recs {_id author {username}	body}}}"
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body.data.users).to.not.equal(null);
                    expect(res.body.data.users[0].username).to.equal("Test1");
                    expect(res.body.data.users[0].email).to.equal("test1@gmail.com");
                    expect(res.body.data.users[0].firstName).to.equal("Testo");
                    expect(res.body.data.users[0].lastName).to.equal("First");
                    expect(res.body.data.users[0].recs).to.be.an("array").that.is.empty;
                    done();
                });
        });
        
        it("should throw a duplicate user error", function(done){
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    "query": "mutation{signup(username: \"Test1\", password: \"pass\", firstName: \"Testo\", lastName: \"First\", email:\"test1@gmail.com\") {token}}"
                })
                .expect(200)
                .end(function(err,res){
                    expect(res.body.data.signup).to.equal(null);
                    expect(res.body.errors[0].message).to.be.a("string");
                    done();
                });
        });
    });
});
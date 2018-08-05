var should = require("chai").should(),
    mocha = require("mocha"),
    expect = require("chai").expect,
    supertest = require("supertest"),
    api=supertest("https://restaurant-ff-server-psielie.c9users.io/graphql");

describe("User", function(){
    
    it('should return a 200 response', function (done) {
        api.post('/')
            .set('Accept', 'application/json')
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjYzNmFhOGVkNjU3ZDE0YWU0ZWJhMDEiLCJpYXQiOjE1MzMyNDIwMjV9.WkmVm8mvNPVhSDJSM4oD3u4J7gNQbVnEAbikxoXxBUg")
            .send({
                "query": "{me{username}}"
            })
            .expect(200, done);
    });
})
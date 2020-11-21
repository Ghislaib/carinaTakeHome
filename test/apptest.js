let chai = require("chai");
let chaiHttp = require("chai-http");
var should = chai.should();
chai.use(chaiHttp);
let server = require("../app");

//Our parent block
describe("Start running tests", () => {
  describe("/GET /shoot/:play/:player_name", () => {
      it("it should test for the right input parameter", (done) => {
      chai.request(server)
        .get("/shoot/:play/:player_name")
        .query({play: 'rock', player_name: 'ghis'})
        .end((err, res) => {
              console.log(res.body);
              (res).should.have.status(200);
              (res.body).should.be.a("text");
              // (res.body).should.be.eql("ghis wins the round");
              done();
           });
        });
   });

  describe("/GET leaderboard", () => {
        it("it should return an object of winners", (done) => {
          chai.request(server)
            .get("/leaderboard")
            .end((err, res) => {
                  (res).should.have.status(200);
                  (res.body).should.be.a("object");
                  (res.body.leaderBoard.length).should.be.eql(0);
                  done();
              })
            });
        });
});
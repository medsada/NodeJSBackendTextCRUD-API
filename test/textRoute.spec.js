const chai = require("chai");
const chaiHttp = require("chai-http");
const Text = require("../models/textModel");
chai.use(chaiHttp);
const server = require("../index");
const { describe, it } = require("mocha");
chai.should();

describe("Integration Testing of all routes", () => {
  describe("/POST Text", () => {
    after(() => {
      Text.findOneAndDelete({ "text.fr": "ajout reussi" }, function () {});
    });

    it("should save and return new text", (done) => {
      chai
        .request(server)
        .post("/text")
        .send({
          text: {
            ar: "محاولة ناجحة",
            fr: "ajout reussi",
            en: "succesful add",
          },
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });

    it("should return status 400 and msg : empty error", (done) => {
      chai
        .request(server)
        .post("/text")
        .send({
          text: { ar: "محاولة سيئة", en: "failure add" },
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("error");
          done();
        });
    });
  });

  describe("/GET Texts", () => {
    it("should return first page of texts list", (done) => {
      chai
        .request(server)
        .get("/text")
        .query({ pageIndex: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("/PUT Text", () => {
    after(() => {
      Text.findByIdAndUpdate(
        "610a687f04dfff0494cf0604",
        {
          text: {
            ar: "قبل تغير",
            fr: "avant la modification",
            en: "before update",
          },
        },
        function () {}
      );
    });
    it("should update and return new text", (done) => {
      chai
        .request(server)
        .put("/text/610a687f04dfff0494cf0604")
        .send({
          text: {
            ar: "تغير ناجح",
            fr: "modification reussie",
            en: "succesful update",
          },
        })
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });

    it("should return status 400 and msg : empty error", (done) => {
      chai
        .request(server)
        .put("/text/610a687f04dfff0494cf0604")
        .send({
          text: { ar: "محاولة سيئة", en: "failure update" },
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("error");
          done();
        });
    });

    it("should return status 400 and msg : not found error", (done) => {
      chai
        .request(server)
        .put("/text/610a687f04dfff0494cf0000")
        .send({
          text: {
            ar: "محاولة سيئة",
            fr: "modification sur un text non existant",
            en: "failure update",
          },
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("error").eq("not found");
          done();
        });
    });
  });

  describe("/GET Count", () => {
    it("should return Count of the text id", (done) => {
      chai
        .request(server)
        .get("/text/60e5d3b8c74a3c0dac3ed071/count")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.nested.property("count.totalCount").eq(37);
          done();
        });
    });
  });

  describe("/GET Count By Lang", () => {
    it("should return Count Language of the text id", (done) => {
      chai
        .request(server)
        .get("/text/60e5d366c74a3c0dac3ed06d/count/fr")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("fr").eq(13);
          done();
        });
    });
  });

  describe("/GET Search Texts", () => {
    it("should return texts list of search result", (done) => {
      chai
        .request(server)
        .get("/text/search")
        .query({ q: "avant" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("should return error of empty search text", (done) => {
      chai
        .request(server)
        .get("/text/search")
        .query({ q: "" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("error").eq("empty search text");
          done();
        });
    });
  });

  describe("/GET Most Occurrent Word", () => {
    it("should return the most occurrent word", (done) => {
      chai
        .request(server)
        .get("/text/mostOccurrent")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("word").eq("قانون");
          res.body.should.have.property("n").eq(6);
          done();
        });
    });
  });
});

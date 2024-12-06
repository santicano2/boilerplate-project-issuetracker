const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  chai
    .request(server)
    .keepOpen()
    .delete(`/api/issues/chant?issue_title=test 1`)
    .end(function (err, res) {});

  suite("POST Tests", function () {
    test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      let output = {
        issue_title: "test 1",
        issue_text: "test",
        status_text: "test",
        created_by: "chant",
        assigned_to: "chant",
      };

      chai
        .request(server)
        .keepOpen()
        .post(
          `/api/issues/chant?issue_title=test 1&issue_text=test&created_by=chant&assigned_to=chant&status_text=test`
        )
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);

          let {
            issue_title,
            issue_text,
            status_text,
            created_by,
            assigned_to,
            ...other
          } = JSON.parse(res.text);
          assert.equal(issue_title, output.issue_title);
          assert.equal(issue_text, output.issue_text);
          assert.equal(status_text, output.status_text);
          assert.equal(created_by, output.created_by);
          assert.equal(assigned_to, output.assigned_to);
          done();
        });
    });

    test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      let output = {
        issue_title: "test 2",
        issue_text: "test",
        status_text: "",
        created_by: "chant",
        assigned_to: "",
      };

      chai
        .request(server)
        .keepOpen()
        .post(
          `/api/issues/chant?issue_title=test 2&issue_text=test&created_by=chant`
        )
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);

          let {
            issue_title,
            issue_text,
            status_text,
            created_by,
            assigned_to,
            ...other
          } = JSON.parse(res.text);
          assert.equal(issue_title, output.issue_title);
          assert.equal(issue_text, output.issue_text);
          assert.equal(status_text, output.status_text);
          assert.equal(created_by, output.created_by);
          assert.equal(assigned_to, output.assigned_to);
          done();
        });
    });

    test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      let output = { error: "required field(s) missing" };

      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/chant?issue_title=test")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(res.text, JSON.stringify(output));
          done();
        });
    });
  });

  suite("GET Tests", function () {
    test("View issues on a project: GET request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/chant")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(Object.keys(JSON.parse(res.text)).length, 2);
          done();
        });
    });

    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/chant?issue_title=test 1")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(Object.keys(JSON.parse(res.text)).length, 1);
          done();
        });
    });

    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/chant?issue_title=test 2&created_by=me")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(Object.keys(JSON.parse(res.text)).length, 0);
          done();
        });
    });
  });

  suite("PUT Tests", function () {
    test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/chant?issue_title=test 1")
        .end(function (err, res) {
          let { _id } = JSON.parse(res.text)[0];
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/chant?_id=" + _id + "&assigned_to=me")
            .end(function (err, res) {
              assert.equal(err, null);
              assert.equal(res.status, 200);
              assert.equal(
                res.text,
                `{"result":"successfully updated","_id":"${_id}"}`
              );
              done();
            });
        });
    });

    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/chant?issue_title=test 1")
        .end(function (err, res) {
          let { _id } = JSON.parse(res.text)[0];
          chai
            .request(server)
            .keepOpen()
            .put(
              "/api/issues/chant?_id=" +
                _id +
                "&assigned_to=chant&issue_text=put test"
            )
            .end(function (err, res) {
              assert.equal(err, null);
              assert.equal(res.status, 200);
              assert.equal(
                res.text,
                `{"result":"successfully updated","_id":"${_id}"}`
              );
              done();
            });
        });
    });

    test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/chant?assigned_to=me")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(res.text, `{"error":"missing _id"}`);
          done();
        });
    });

    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/chant?issue_title=test 1")
        .end(function (err, res) {
          let { _id } = JSON.parse(res.text)[0];
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/chant?_id=" + _id)
            .end(function (err, res) {
              assert.equal(err, null);
              assert.equal(res.status, 200);
              assert.equal(
                res.text,
                `{"error":"no update field(s) sent","_id":"${_id}"}`
              );
              done();
            });
        });
    });

    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/chant?_id=invalid&assigned_to=me")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(
            res.text,
            `{"error":"could not update","_id":"invalid"}`
          );
          done();
        });
    });
  });

  suite("DELETE Tests", function () {
    test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/chant?issue_title=test 1")
        .end(function (err, res) {
          let { _id } = JSON.parse(res.text)[0];
          chai
            .request(server)
            .keepOpen()
            .delete("/api/issues/chant?_id=" + _id)
            .end(function (err, res) {
              assert.equal(err, null);
              assert.equal(res.status, 200);
              assert.equal(
                res.text,
                `{"result":"successfully deleted","_id":"${_id}"}`
              );
              done();
            });
        });
    });

    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/chant?_id=invalid")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(
            res.text,
            `{"error":"could not delete","_id":"invalid"}`
          );
          done();
        });
    });

    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
      assert.isTrue(true);
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/chant?created_by=chant")
        .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(res.text, `{"error":"missing _id"}`);
          done();
        });
    });
  });
});

function testResponse(path, output, done) {
  chai
    .request(server)
    .keepOpen()
    .get(path)
    .end(function (err, res) {
      assert.equal(err, null);
      assert.equal(res.status, 200);
      assert.equal(res.text, JSON.stringify(output));
      done();
    });
}

"use strict";
const { IssueModel } = require("../models/Issue");

module.exports = function (app) {
  IssueModel.deleteMany().exec();

  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      console.log("GET id:\n\t" + project);

      let params = getParams(req);
      console.log("GET params:\n\t" + JSON.stringify(params));

      IssueModel.find({ project, ...params }).then((items) => {
        res.json(items);
        console.log("GET result:\n\t" + JSON.stringify(items));
        console.log(
          "\n--------------------------------------------------------------------\n"
        );
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
      console.log("POST id:\n\t" + project);

      let params = getParams(req);
      console.log("POST params:\n\t" + JSON.stringify(params));
      console.log("POST query:\n\t" + JSON.stringify(req.query));
      let issue = new IssueModel({
        project: project,
        issue_title: params.issue_title,
        issue_text: params.issue_text,
        created_by: params.created_by,
        assigned_to: params.assigned_to || "",
        status_text: params.status_text || "",
      });

      issue
        .save()
        .then((item) => {
          console.log("Added item to database:\n\t" + JSON.stringify(item));
          console.log(
            "\n--------------------------------------------------------------------\n"
          );
          res.json(item);
        })
        .catch((err) => {
          console.log("Can't add item to database:\n\t" + err);
          console.log(
            "\n--------------------------------------------------------------------\n"
          );
          res.json({ error: "required field(s) missing" });
        });
    })

    .put(function (req, res) {
      let project = req.params.project;
      console.log("PUT project id:\n\t" + project);

      let params = getParams(req);
      console.log("PUT params:\n\t" + JSON.stringify(params));

      if (params._id === undefined) {
        console.log("PUT _id is null");
        console.log(
          "\n--------------------------------------------------------------------\n"
        );
        res.json({ error: "missing _id" });
        return;
      }

      let { _id, ...updated } = params;
      if (Object.keys(updated).length == 0) {
        console.log("PUT updated params are empty");
        console.log(
          "\n--------------------------------------------------------------------\n"
        );
        res.json({ error: "no update field(s) sent", _id });
        return;
      }

      IssueModel.findByIdAndUpdate(
        _id,
        { ...updated, updated_on: new Date() },
        { new: true }
      )
        .then((item) => {
          if (!item) {
            throw new Error("issue not found");
          }
          console.log("Updated item in database:\n\t" + JSON.stringify(item));
          console.log(
            "\n--------------------------------------------------------------------\n"
          );
          res.json({ result: "successfully updated", _id });
        })
        .catch((err) => {
          console.log("Can't update item in database:\n\t" + err);
          console.log(
            "\n--------------------------------------------------------------------\n"
          );
          res.json({ error: "could not update", _id });
        });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      console.log("DELETE id:\n\t" + project);

      let params = getParams(req);
      console.log("DELETE params:\n\t" + JSON.stringify(params));

      if (params._id === undefined) {
        console.log("DELETE _id is null");
        console.log(
          "\n--------------------------------------------------------------------\n"
        );
        res.json({ error: "missing _id" });
        return;
      }

      IssueModel.findByIdAndDelete({ project, ...params })
        .then((item) => {
          if (!item) {
            throw new Error("issue not found");
          }

          console.log("Deleted item from database:\n\t" + JSON.stringify(item));
          console.log(
            "\n--------------------------------------------------------------------\n"
          );
          res.json({ result: "successfully deleted", _id: params._id });
        })
        .catch((err) => {
          console.log("Can't delete item from database:\n\t" + err);
          console.log(
            "\n--------------------------------------------------------------------\n"
          );
          res.json({ error: "could not delete", _id: params._id });
        });
    });
};

function getParams(req) {
  if (Object.keys(req.body).length > 0) {
    return req.body;
  }

  if (Object.keys(req.query).length > 0) {
    return req.query;
  }

  return {};
}

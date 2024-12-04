"use strict";
const mongoose = require("mongoose");

module.exports = function (app) {
  const IssueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    status_text: { type: String, default: "" },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    open: { type: Boolean, default: true },
  });

  const Issue = mongoose.model("Issue", IssueSchema);

  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      let filterObj = { ...req.query, project };

      try {
        const issues = await Issue.find(filterObj);
        res.json(issues);
      } catch (err) {
        res.json({ error: "could not get issues" });
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to = "",
        status_text = "",
        open = true,
      } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      const newIssue = new Issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      });

      try {
        const savedIssue = await newIssue.save();
        res.json(savedIssue);
      } catch (err) {
        res.json({ error: "could not create issue" });
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const { _id, ...updateFields } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }

      try {
        updateFields.updated_on = Date.now();
        const issue = await Issue.findByIdAndUpdate(_id, updateFields, {
          new: true,
        });

        if (!issue) {
          return res.json({ error: "could not update", _id: _id });
        }

        res.json({ result: "sucessfully updated", _id: _id });
      } catch (err) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      try {
        const result = await Issue.findByIdAndDelete(_id);

        if (!result) {
          return res.json({ error: "could not delete", _id: _id });
        }

        res.json({ result: "successfully deleted", _id: _id });
      } catch (err) {
        res.json({ error: "could not delete", _id: _id });
      }
    });
};

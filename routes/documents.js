const express = require("express");
const router = express.Router();
const Document = require("../models/document");
const { DocumentBodySchema } = require("./validators/validators");
const validator = require("express-joi-validator");

router.get("/", (req, res, next) => {
  Document.find({})
    .then(found => {
      res.send(found);
    })
    .catch(next);
});

router.get("/:docId", (req, res, next) => {
  Document.findById(req.params.docId)
    .populate("owner")
    .populate("authors")
    .then(record => {
      console.log(record);
      res.send(record);
    })
    .catch(next);
});

router.post("/", validator(DocumentBodySchema), (req, res, next) => {
  Document.create(req.body)
    .then(added => {
      res.send(added);
    })
    .catch(next);
});

router.delete("/:docId", (req, res, next) => {
  Document.findByIdAndRemove(req.params.docId)
    .then(deleted => {
      res.sendStatus(204);
    })
    .catch(next);
});

router.put("/:docId", validator(DocumentBodySchema), (req, res, next) => {
  Document.findByIdAndUpdate(req.params.docId, req.body, { new: true })
    .then(updated => {
      res.send(updated);
    })
    .catch(next);
});

module.exports = router;

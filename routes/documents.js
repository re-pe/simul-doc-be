const express = require('express');

const router = express.Router();
const Document = require('../models/document');
const { DocumentBodySchema } = require('./validators/validators');
const validator = require('express-joi-validator');

router.get('/', (req, res, next) => {
  Document.find({})
    .populate('owner', '_id firstName lastName')
    .populate('authors', '_id firstName lastName')
    .then((document) => {
      res.send(document);
    })
    .catch(next);
});

router.get('/:docId', (req, res, next) => {
  Document.findById(req.params.docId)
    .populate('owner', '_id firstName lastName')
    .populate('authors', '_id firstName lastName')
    .then((document) => {
      res.send(document);
    })
    .catch(next);
});

router.post('/', validator(DocumentBodySchema), (req, res, next) => {
  Document.create(req.body)
    .then((document) => {
      res.send(document);
    })
    .catch(next);
});

router.delete('/:docId', (req, res, next) => {
  Document.findByIdAndRemove(req.params.docId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

router.put('/:docId', validator(DocumentBodySchema), (req, res, next) => {
  Document.findByIdAndUpdate(req.params.docId, req.body, { new: true })
    .then((document) => {
      res.send(document);
    })
    .catch(next);
});

module.exports = router;

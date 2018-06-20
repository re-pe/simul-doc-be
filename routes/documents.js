const express = require('express');
const isAuthenticated = require('./authentication/autehntication');

const router = express.Router();
const Document = require('../models/document');
const { DocumentBodySchema } = require('./validators/validators');
const validator = require('express-joi-validator');


router.get('/', isAuthenticated, (req, res, next) =>
  Document.find({ authors: req.user.id })
    .select('-content')
    .then((document) => {
      res.send(document);
    })
    .catch(next));


router.get('/:docId', isAuthenticated, (req, res, next) =>
  Document.findOne({
    _id: req.params.docId,
    authors: req.user.id,
  })
    .populate('owner', '-createdAt -updatedAt')
    .populate('authors', '-createdAt -updatedAt')
    .then(document => res.send(document))
    .catch(next));

router.post('/', isAuthenticated, validator(DocumentBodySchema), (req, res, next) =>
  Document.create(req.body)
    .then(createdDocument =>
      Document.findById(createdDocument.id)
        .populate('owner', '-createdAt -updatedAt')
        .populate('authors', '-createdAt -updatedAt')
        .then(document => res.send(document))
        .catch(next))
    .catch(next));

router.delete('/:docId', isAuthenticated, (req, res, next) =>
  Document.findOneAndRemove({
    _id: req.params.docId,
    owner: req.user.id,
  })
    .then(() => res.sendStatus(204))
    .catch(next));

router.put('/:docId', isAuthenticated, validator(DocumentBodySchema), (req, res, next) =>
  Document
    .findOneAndUpdate({
      _id: req.params.docId, authors: req.user.id,
    }, req.body, { new: true })
    .populate('owner', '-createdAt -updatedAt')
    .populate('authors', '-createdAt -updatedAt')
    .then(document => res.send(document))
    .catch(next));

module.exports = router;

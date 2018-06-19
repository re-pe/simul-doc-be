const express = require('express');
const isAuthenticated = require('./authentication/autehntication');

const router = express.Router();
const Document = require('../models/document');
const { DocumentBodySchema } = require('./validators/validators');
const validator = require('express-joi-validator');


router.get('/', isAuthenticated, (req, res, next) =>
  Document.find({ authors: req.signedCookies['simul-doc'] })
    .select('-content')
    .then((document) => {
      res.send(document);
    })
    .catch(next));


router.get('/:docId', isAuthenticated, (req, res, next) =>
  Document.findById(req.params.docId)
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
  Document.findByIdAndRemove(req.params.docId)
    .then(() => res.sendStatus(204))
    .catch(next));

router.put('/:docId', isAuthenticated, validator(DocumentBodySchema), (req, res, next) =>
  Document
    .findByIdAndUpdate(req.params.docId, req.body, { new: true })
    .populate('authors', '-createdAt -updatedAt')
    .then(document => res.send(document))
    .catch(next));

module.exports = router;

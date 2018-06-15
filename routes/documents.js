const express = require('express');

const router = express.Router();
const Document = require('../models/document');
const User = require('../models/user');
const { DocumentBodySchema } = require('./validators/validators');
const validator = require('express-joi-validator');

const sendError = (res) => {
  res.status(401).send({
    message: 'User is not logged!',
    status: 401,
  });
  return null;
};

const userLogged = (req, res) => {
  return User.findById(req.signedCookies['simul-doc'])
    .then(user => user || sendError(res));
};

router.get('/', (req, res, next) =>
  userLogged(req, res).then((user) => {
    if (!user) return null;
    return Document.find({ owner: user.id })
      .select('-content')
      .then((document) => {
        res.send(document);
      })
      .catch(next);
  })
    .catch(next));

router.get('/:docId', (req, res, next) =>
  userLogged(req, res)
    .then((user) => {
      if (!user) return null;
      return Document.findById(user.id)
        .populate('owner', '-createdAt -updatedAt')
        .populate('authors', '-createdAt -updatedAt')
        .then((document) => {
          res.send(document);
        })
        .catch(next);
    })
    .catch(next));

router.post('/', validator(DocumentBodySchema), (req, res, next) =>
  userLogged(req, res)
    .then((user) => {
      if (!user) return null;
      return Document.create(req.body)
        .then(createdDocument =>
          Document.findById(createdDocument.id)
            .populate('owner', '-createdAt -updatedAt')
            .populate('authors', '-createdAt -updatedAt')
            .then(foundDocument => res.send(foundDocument))
            .catch(next))
        .catch(next);
    })
    .catch(next));

router.delete('/:docId', (req, res, next) =>
  userLogged(req, res)
    .then((user) => {
      if (!user) return null;
      return Document.findByIdAndRemove(req.params.docId)
        .then(() => {
          res.sendStatus(204);
        })
        .catch(next);
    }));

router.put('/:docId', validator(DocumentBodySchema), (req, res, next) =>
  userLogged(req, res)
    .then((user) => {
      if (!user) return null;
      return Document.findByIdAndUpdate(
        req.params.docId, req.body, { new: true })
        .populate('authors', '-createdAt -updatedAt')
        .then((document) => {
          res.send(document);
        })
        .catch(next);
    }));

module.exports = router;

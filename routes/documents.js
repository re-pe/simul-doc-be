const express = require('express');

const router = express.Router();
const Document = require('../models/document');
const User = require('../models/user');
const { DocumentBodySchema } = require('./validators/validators');
const validator = require('express-joi-validator');

const userLogged = (req, next) => {
  const id = req.signedCookies['simul-doc'];
  return User.findById(id)
    .then((user) => {
      if (!user) {
        const err = {
          message: 'Not authorized! Go back!',
          status: 400,
        };
        return err;
      }
      return user;
    })
    .catch(next);
};

router.get('/', (req, res, next) => {
  Document.find({})
    .select('-content')
    .then((document) => {
      res.send(document);
    })
    .catch(next);
});

router.get('/:docId', (req, res, next) => {
  Document.findById(req.params.docId)
    .populate('owner', '-createdAt -updatedAt')
    .populate('authors', '-createdAt -updatedAt')
    .then((document) => {
      res.send(document);
    })
    .catch(next);
});

router.post('/', validator(DocumentBodySchema), async (req, res, next) => {
  const id = await Document.create(req.body)
    .then(document => document.id)
    .catch(next);
  Document.findById(id)
    .populate('owner', '-createdAt -updatedAt')
    .populate('authors', '-createdAt -updatedAt')
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
    .populate('authors', '-createdAt -updatedAt')
    .then((document) => {
      res.send(document);
    })
    .catch(next);
});

module.exports = router;

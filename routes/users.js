const app = require('express');
const User = require('../models/user');
const { UserBodySchema } = require('./validators/validators');
const validator = require('express-joi-validator');
// const bcrypt = require('bcrypt');

const router = app.Router();

// patikrinti, kas gražinama

router.get('/', (req, res, next) => {
  User.find({})
    .then(users => res.send(users))
    .catch(next);
});

router.get('/:usrId', (req, res, next) => {
  User.findById(req.params.usrId)
    .then(user => res.send(user))
    .catch(next);
});

router.post('/', validator(UserBodySchema), (req, res, next) => {
  User.create(req.body)
    .then(user => res.send(user))
    .catch(next);
});

router.delete('/:usrId', (req, res, next) => {
  User.findByIdAndRemove(req.params.usrId)
    .then((result) => {
      res.send(result);
    })
    .catch(next);
});

router.put('/:usrId', validator(UserBodySchema), (req, res, next) => {
  if (req.signedCookies['simul-doc'] !== req.params.usrId) {
    return next();
  }
  return User.findOneAndUpdate({ _id: req.params.usrId }, req.body, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
});

module.exports = router;

const Joi = require('joi');
const app = require('express');
// const cors = require('cors')
const router = app.Router();
const User = require('../models/user')
const validator = require('express-joi-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then(records => {
      res.send(records);
    })
    .catch(next);

});

const querySchema = {body: {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
}};

router.post(
  '/', 
  validator(querySchema),
  function (req, res, next) {
    User.create(req.body)
      .then(added => {
        res.send(added);
      })
      .catch(next);
  }
);

router.get('/:usrId', function(req, res, next) {
  User.findById(req.params.usrId)
    .then(record => {
      res.send(record);
    })
    .catch(next);

});

router.delete('/:usrId', (req, res, next) => {
  User.findByIdAndRemove(req.params.usrId)
        .then(deleted => {
          res.sendStatus(204);
        })
        .catch(next);
})

router.put('/:usrId', (req, res, next) => {
  Document.findByIdAndUpdate(req.params.usrId, req.body, { new: true })
        .then(updated => {
          res.send(updated);
        })
        .catch(next);
})

module.exports = router;

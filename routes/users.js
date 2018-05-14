const Joi = require('joi');
const app = require('express');
// const cors = require('cors')
const router = app.Router();
const User = require('../models/user')
const { UserBodySchema } = require('./validators/validators');
const validator = require('express-joi-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then(records => {
      res.send(records);
    })
    .catch(next);

});


router.post('/', validator(UserBodySchema), (req, res, next) => {
    User.create(req.body)
      .then(added => {
        res.send(added);
      })
      .catch(next);
  }
);

router.get('/:usrId', (req, res, next) => {
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

router.put('/:usrId', validator(UserBodySchema), (req, res, next) => {
  User.findByIdAndUpdate(req.params.usrId, req.body, { new: true })
    .then(updated => {
      res.send(updated);
    })
    .catch(next);
});

module.exports = router;

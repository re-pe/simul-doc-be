const Joi = require('joi');
const app = require('express');
// const cors = require('cors')
const router = app.Router();
const User = require('../models/user')
const validator = require('express-joi-validation')({})

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then(records => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
      res.send(records);
    })
    .catch(next);

});

const querySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

router.post(
  '/', 
  validator.query(querySchema), 
  function (req, res, next) {
    User.create(req.body)
      .then(added => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
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

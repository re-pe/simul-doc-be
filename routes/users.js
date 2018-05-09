const express = require('express');
const router = express.Router();
const User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then(records => {
      res.send(records);
    })
    .catch(next);

});

router.post('/', function (req, res, next) {
  User.create(req.body)
    .then(added => {
      res.send(added);
    })
    .catch(next);
})

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
          res.status(204).send();
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

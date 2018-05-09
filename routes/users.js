const express = require('express');
const router = express.Router();
const User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then(records => {
      res.send(records);
    })
    .catch(next)

});

router.get('/:usrId', function(req, res, next) {
  User.findById(req.params.usrId)
    .then(record => {
      res.send(record);
    })
    .catch(next)

});

router.post('/', function (req, res, next) {
  User.create(req.body)
    .then(usr => {
      res.send(usr)
    })
    .catch(next);
})


module.exports = router;

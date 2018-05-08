var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then(records => {
      res.send(records);
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

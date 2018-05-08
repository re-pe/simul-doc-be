var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, (err, records) => {
    if (err) {
      res.send('error when trying get users')
    };
    res.send(records);
  })
});

router.post('/', function (req, res) {
  User.create(req.body)
        .then(usr => {
          res.send(usr)
        })
        .catch(error => {
          res.send('Unable to add user')
        })
})


module.exports = router;

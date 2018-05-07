var express = require('express')
var router = express.Router()
var Document = require('../models/document')

/* GET documents listing. */
router.get('/', function (req, res) {
  Document.find({}, (err, records) => {
    if (err) {
      res.send('error when trying get documents')
    }
    res.send(records)
  })
})

router.post('/', function (req, res) {
  Document.create(req.body)
        .then(doc => {
          res.send(doc)
        })
        .catch(error => {
          res.send('Unable to add user document')
        })
})

module.exports = router

var express = require('express')
var router = express.Router()
var Document = require('../models/document')

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
        .catch(err => {
          res.send('Unable to add user document\nError:'+err)
        })
})

router.delete('/:docId', (req, res) => {
  Document.findByIdAndRemove(req.params.docId)
        .then(doc => {
          res.send(doc)
        })
        .catch(err => {
          res.send('Unable to remove document\nError:'+err)
        })
})

module.exports = router

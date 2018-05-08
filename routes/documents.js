var express = require('express')
var router = express.Router()
var Document = require('../models/document')

router.get('/', function (req, res, next) {
  Document.find({})
        .then(found => {
          res.send(found)
        })
        .catch(next)
})

router.post('/', function (req, res, next) {
  Document.create(req.body)
        .then(added => {
          res.send(added)
        })
        .catch(next)
})

router.delete('/:docId', (req, res, next) => {
  Document.findByIdAndRemove(req.params.docId)
        .then(deleted => {
          res.send(deleted)
        })
        .catch(next)
})

router.put('/:docId', (req, res, next) => {
  Document.findByIdAndUpdate(req.params.docId, req.body, { new: true })
        .then(updated => {
          res.send(updated)
        })
        .catch(next)
})

module.exports = router

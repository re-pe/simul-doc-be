const express = require('express')
const router = express.Router()
const Document = require('../models/document')

router.get('/', function (req, res, next) {
  Document.find({})
        .then(found => {
          res.send(found)
        })
        .catch(next)
})

router.get('/:docId', function (req, res, next) {
  Document.findById(req.params.docId)
    .populate('owner')
    .populate( 'authors')
    .then(record => {
      console.log(record);
      res.send(record);
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

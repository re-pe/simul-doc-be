const express = require('express')
const router = express.Router()
const Document = require('../models/document')

/* GET documents listing. */
router.get('/', function (req, res) {
  Document.find({}, (err, records) => {
    if (err) {
      res.send('error when trying get documents')
    }
    res.send(records)
  })
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

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
  const def = new Document()
  def.owner = 'Default ovner'
  def.authors.push('Defaul author')
  def.title = 'Default title'
  def.content = 'Default content'
  def.save(error => {
    if (error) {
      res.send('Unable to add default document')
    }
  })
  res.send('default user added')
})

module.exports = router

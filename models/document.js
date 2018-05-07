var mongoose = require('mongoose')

var Schema = mongoose.Schema

var DocumentSchema = new Schema(
  {
    owner: { type: String, required: true },
    authors: { type: [String] },
    title: { type: String },
    content: { type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Document', DocumentSchema)

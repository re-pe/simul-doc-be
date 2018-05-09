const mongoose = require('mongoose')

const Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

const DocumentSchema = new Schema(
  {
    owner: { type: ObjectId, required: true , ref: 'User' },
    authors: [{ type: ObjectId , ref: 'User' }],
    title: { type: String },
    content: { type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Document', DocumentSchema)

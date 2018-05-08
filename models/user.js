var mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserSchema = new Schema(
  {
    firstName : {type: String, required: true},
    lastName: { type: String, required: true },
    email: { type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', UserSchema)

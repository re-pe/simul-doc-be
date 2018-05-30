const mongoose = require('mongoose');

const { Schema } = mongoose;

const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.static('authenticate', function authenticate(username, password, callback) {
  return this.findOne({
    email: username,
  }).then((user) => {
    bcrypt.compare(password, user.password).then(result =>
      (result ?
        callback(null, user) :
        callback(
          {
            message: "Password or username didn't match.",
            status: 401,
          },
          null,
        )));
  }).catch(() => callback(
    { message: "Password or username didn't match.", status: 401 },
    null,
  ));
});

UserSchema.pre('save', function save(next) {
  const user = this;
  bcrypt.hash(user.password, saltRounds).then((hash) => {
    user.password = hash;
    return next();
  }).catch(err => next(err));
});

module.exports = mongoose.model('User', UserSchema);

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
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        return callback(null, user);
      }
      return callback(
        {
          message: "Password or username didn't match.",
          status: 401,
        },
        null,
      );
    });
  }).catch(() => callback(
    { message: "Password or username didn't match.", status: 401 },
    null,
  ));
});

UserSchema.pre('save', function save(next) {
  const user = this;
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    return next();
  });
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const UserSchema = new Schema({
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
    select: false,
  },
}, {
  timestamps: true,
});

UserSchema.static('authenticate', function authenticate(username, password, callback) {
  return this.findOne({
    email: username,
  }, 'password').then((user) => {
    bcrypt.compare(password, user.password)
      .then(result => callback(result ? user : null))
      .catch(() => callback(null));
  }).catch(() => callback(null));
});

UserSchema.pre('findOneAndUpdate', function update(next) {
  const userData = this._update;
  if (!userData.password) {
    return next();
  }
  return bcrypt.hash(userData.password, SALT_ROUNDS).then((hash) => {
    userData.password = hash;
    return next();
  }).catch(next);
});


UserSchema.pre('save', function save(next) {
  const user = this;
  bcrypt.hash(user.password, SALT_ROUNDS).then((hash) => {
    user.password = hash;
    return next();
  }).catch(next);
});

module.exports = mongoose.model('User', UserSchema);

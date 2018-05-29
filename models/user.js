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

UserSchema.static('authenticate', (username, password, callback) => this.findOne({
  email: username,
}).then((user) => {
  if (!user) {
    return callback(
      { message: "Password or username didn't match.", status: 401 },
      null,
    );
  }
  const result = bcrypt.compareSync(password, user.password);
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
}));

UserSchema.pre('save', (next) => {
  const user = this;
  user.password = bcrypt.hashSync(user.password, saltRounds);
  next();
});

UserSchema.pre('update', (next) => {
  const query = this;

  const { password } = this._update;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
    if (err) {
      return next(err);
    }
    query.update({}, { $set: { password: hash } });
    return next();
  });
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.static("authenticate", function(username, password, callback) {
  return this.findOne({
    email: username
  }).then(function(user) {
    if (!user) {
      return callback(
        { message: "Password or username didn't match.", status: 401 },
        null
      );
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback(
          {
            message: "Password or username didn't match.",
            status: 401
          },
          null
        );
      }
    });
  });
});

UserSchema.pre("save", function(next) {
  const user = this;
  bcrypt.hash(user.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", UserSchema);

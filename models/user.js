const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new Schema(
    {
        firstName : {type: String, required: true},
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password:{type: String, required: true},
    },
    {
        timestamps: true
    }
)

//const salt = "Tai - tekstas druskai";

UserSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, saltRounds, function (err, hash){
            // Store hash in your password DB.
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
    })
  });

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
            return callback(null, user);
            } else {
            return callback();
            }
        })
    });
}

module.exports = mongoose.model('User', UserSchema)

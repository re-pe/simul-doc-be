//const Joi = require('joi');
const app = require("express");
const router = app.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { UserBodyLoginSchema } = require("./validators/validators");
const validator = require("express-joi-validator");

router.post("/", validator(UserBodyLoginSchema), (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, function(error, user) {
    console.log(error);
    if (error || !user) {
      const err = new Error("Wrong email or password.");
      err.status = 401;
      return next(err);
    } else {
      req.session.userId = user._id;
      res.cookie("simul-doc", user._id, { signed: true, httpOnly: true });
      res.send({ message: "User is authenticated." });
    }
  }).catch(next);
});

module.exports = router;

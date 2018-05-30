const app = require('express');

const router = app.Router();
const User = require('../models/user');
const { UserBodyLoginSchema } = require('./validators/validators');
const validator = require('express-joi-validator');

router.post('/', validator(UserBodyLoginSchema), (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (error, user) => {
    if (error) {
      const err = new Error('Error! Wrong email or password.');
      err.status = 401;
      return next(error);
    } else if (!user) {
      const err = new Error('User! Wrong email or password.');
      err.status = 401;
      return next(err);
    }
    req.session.userId = user._id;
    res.cookie('simul-doc', user._id, { signed: true, httpOnly: true });
    return res.send({ message: 'User is authenticated.' });
  }).catch(next);
});

module.exports = router;

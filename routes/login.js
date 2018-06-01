const app = require('express');

const router = app.Router();
const User = require('../models/user');
const { UserBodyLoginSchema } = require('./validators/validators');
const validator = require('express-joi-validator');

router.post('/', validator(UserBodyLoginSchema), (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (user) => {
    if (!user) {
      const err = { message: 'Wrong email or password.' };
      err.status = 401;
      return res.status(401).send(err);
    }
    req.session.userId = user.id;
    res.cookie('simul-doc', user.id, { signed: true, httpOnly: true });
    return res.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }).catch(next);
});

module.exports = router;

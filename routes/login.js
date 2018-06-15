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
    return User.findById(user.id)
      .select('-createdAt -updatedAt -__v')
      .then((found) => {
        req.session.userId = found.id;
        res.cookie('simul-doc', found.id, { signed: true, httpOnly: true });
        return res.send(found);
      })
      .catch(next);
  }).catch(next);
});

module.exports = router;

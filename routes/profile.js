const app = require('express');

const router = app.Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
  /* eslint-disable global-require */
  const { ObjectId } = require('mongoose').Types;
  /* eslint-enable global-require */
  User.findById(ObjectId(req.signedCookies['simul-doc']))
    .then((user) => {
      if (user === null) {
        const err = new Error('Not authorized! Go back!');
        err.status = 400;
        next(err);
      } else {
        res.send({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    })
    .catch(next);
});

module.exports = router;

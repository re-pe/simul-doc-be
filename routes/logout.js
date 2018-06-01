const app = require('express');

const router = app.Router();

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return res.send({ message: 'Logout was successful' });
    });
  }
});

module.exports = router;

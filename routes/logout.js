const app = require('express');

const router = app.Router();

router.get('/', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      const resMessage = { message: [] };
      if (req.signedCookies['simul-doc']) {
        res.clearCookie('simul-doc');
        resMessage.message.push('Cookie was deleted');
      }
      resMessage.message.push('Logout was successful');
      return res.send({ ...resMessage, status: 200 });
    });
  }
});

module.exports = router;

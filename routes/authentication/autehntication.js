const User = require('../../models/user');

const makeError = status => ({
  message: 'User is not logged!',
  status,
});


const isAuthenticated = (req, res, next) =>
  User.findById(req.signedCookies['simul-doc'])
    .then((user) => {
      if (!user) return next(makeError(401));
      req.user = user;
      return next();
    })
    .catch(next);

export default isAuthenticated;

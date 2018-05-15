const Joi = require("joi");
const app = require("express");
const router = app.Router();

router.get("/", function(req, res, next) {
  User.findById(req.session.userId)
    .then(user => {
      if (user === null) {
        const err = new Error("Not authorized! Go back!");
        err.status = 400;
        next(err);
      } else {
        res.send(
          "<h1>Name: </h1>" +
            user.username +
            "<h2>Mail: </h2>" +
            user.email +
            '<br><a type="button" href="/logout">Logout</a>'
        );
      }
    })
    .catch(next);
});

module.exports = router;

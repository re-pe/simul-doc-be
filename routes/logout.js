const app = require("express");
const router = app.Router();

router.get("/logout", function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        res.send({ message: "Logout was successful" });
      }
    });
  }
});

module.exports = router;

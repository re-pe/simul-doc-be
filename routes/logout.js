const app = require("express");
const router = app.Router();

// GET /logout
router.get("/logout", function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        res.send({ message: "Logout was successful" });
        //return re0s.redirect("/");
      }
    });
  }
});

module.exports = router;

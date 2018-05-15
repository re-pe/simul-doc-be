const Joi = require('joi');
const app = require('express');
const router = app.Router();

router.get('/', function(req, res, next) {
    res.send({"text":"User successfully created!"});
});

module.exports = router;

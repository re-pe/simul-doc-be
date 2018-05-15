const Joi = require('joi');
const app = require('express');
const router = app.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user')
const { UserBodyLoginSchema } = require('./validators/validators');
const validator = require('express-joi-validator');

router.post('/', validator( UserBodyLoginSchema), (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(found => {
            bcrypt.compare(req.body.password, found.password, (err, result) => {
                if (result === true) {
                    res.redirect('/documents');
                } else {
                    res.send('The password is wrong!');
                }
            })
//            res.send(found);
        })
        .catch(next);
});

module.exports = router;

const Joi = require('joi');
const app = require('express');
// const cors = require('cors')
const router = app.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user')
const { UserBodyLoginSchema } = require('./validators/validators');
const validator = require('express-joi-validator');

// router.get('/', function(req, res, next) {
//     res.send({"text":"User successfully created!"});
// });

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
    // User.create(req.body)
    //   .then(added => {
    //     res.redirect('/documents');;
    //   })
    //   .catch(next);
    // }
});

module.exports = router;

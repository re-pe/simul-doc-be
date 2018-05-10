const Joi = require('joi');

const ObjectIdValidator = Joi.string().regex(/[0-9a-f]{24}/i);
const NonEmptyString = Joi.string().min(1);
const Password = Joi.string().regex(/[a-z0-9!@#$%^&*_-]/).min(6).max(12);
const DocumenBodytValidator = {
    body: {
      owner: ObjectIdValidator,
      authors: Joi.array().items(ObjectIdValidator),
      title: Joi.string(),
      content: Joi.string()
    }
};
  
const UserBodyValidator = {
    body: {
      firstName: NonEmptyString,
      lastName: NonEmptyString,
      email: Joi.string().email(),
      password: Password
    }
  };
  
module.exports = {
    UserBodyValidator, 
    DocumenBodytValidator
}
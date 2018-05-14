const Joi = require('joi');

const ObjectIdValidator = Joi.string().regex(/[0-9a-f]{24}/i);
const NonEmptyString = Joi.string().min(1);
const EmailString = Joi.string().email();
const PasswordString = Joi.string().regex(/[0-9a-z]{6,12}/i);

const DocumentValidator = {
    owner: ObjectIdValidator,
    authors: Joi.array().items(ObjectIdValidator),
    title: Joi.string(),
    content: Joi.string()
};

const DocumentArrayValidator = Joi.array().items(DocumentValidator);

const DocumentBodySchema = {
    body: Joi.alternatives().try(DocumentValidator, DocumentArrayValidator)
};

const UserValidator = {
    firstName: NonEmptyString,
    lastName: NonEmptyString,
    email: EmailString,
    password: PasswordString
}

const UserArrayValidator = Joi.array().items(UserValidator)

const UserBodySchema = {
    body: Joi.alternatives().try(UserValidator, UserArrayValidator)
};

module.exports = {
    UserBodySchema,
    DocumentBodySchema
}

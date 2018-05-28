const Joi = require('joi');

const ObjectIdValidator = Joi.string().regex(/[0-9a-f]{24}/i);
const NonEmptyString = Joi.string().min(1);
const EmailString = Joi.string().email();
const PasswordString = Joi.string().regex(/[0-9a-z]{6,12}/i);

const DocumentValidator = Joi.object({
    owner: ObjectIdValidator,
    authors: Joi.array().items(ObjectIdValidator),
    title: Joi.string(),
    content: Joi.string()
});

const DocumentBodySchema = {
    body: DocumentValidator
};

const UserValidator = Joi.object({
    firstName: NonEmptyString,
    lastName: NonEmptyString,
    email: EmailString,
    password: PasswordString
});

const UserBodySchema = {
    body: UserValidator
};

const UserLoginValidator = Joi.object({
    email: EmailString,
    password: PasswordString
});

const UserBodyLoginSchema = {
    body: UserLoginValidator
};

module.exports = {
    UserBodySchema,
    UserBodyLoginSchema,
    DocumentBodySchema
}

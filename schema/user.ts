import Joi from "@hapi/joi";

export const schema = Joi.object().keys({
  givenName: Joi.string()
    .max(20)
    .message("Must be less than 20 letters")
    .required(),

  familyName: Joi.string()
    .max(20)
    .message("Must be less than 20 letters")
    .required(),

  username: Joi.string()
    .alphanum()
    .message("No symbols allowed in username")
    .min(3)
    .message("Must be longer than 3 characters")
    .max(30)
    .message("Must be less than 30 characters")
    .required(),

  password: Joi.string(),

  password2: Joi.string(),

  birthDate: Joi.string()
    .isoDate()
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message("Not a valid email")
    .lowercase()
    .required(),

  role: Joi.array(),
});

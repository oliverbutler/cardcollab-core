import Joi from "@hapi/joi";

export const schema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message("Not a valid email"),

  password: Joi.string(),
});

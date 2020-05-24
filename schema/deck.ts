import Joi from "@hapi/joi";

export const schema = Joi.object().keys({
  title: Joi.string(),
  userID: Joi.string(),
  review: Joi.number(),
  module: Joi.string(),
  subject: Joi.string(),
  acl: Joi.array(),
});

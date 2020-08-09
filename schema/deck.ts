import Joi from "@hapi/joi";

export const schema = Joi.object().keys({
  title: Joi.string(),
  userID: Joi.string(),
  review: Joi.number(),
  module: Joi.any(),
  subject: Joi.any(),
  acl: Joi.array(),
});

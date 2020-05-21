import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Joi = require("@hapi/joi");
console.log(Joi.version); // check joi works

const now = Date.now();
const cutoffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100); // go back by 21 years

const schema = Joi.object().keys({
  firstname: Joi.string()
    .capitalise()
    .min(3)
    .max(20)
    .capitalise()
    .required(),

  surname: Joi.string()
    .capitalise()
    .min(3)
    .max(20)
    .capitalise()
    .required(),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .capitalise()
    .required(),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])|(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])| (?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])"
      )
    )
    .required(),

  repeat_password: Joi.ref("password").required(),

  Dob: Joi.string()
    .isoDate()
    .max(cutoffDate)
    .min(now)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .lowercase()
    .required(),
});

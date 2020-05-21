import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Auth from "@aws-amplify/auth";
import { SignUpParams } from "@aws-amplify/auth/lib-esm/types";
import PasswordCheck from "components/passwordCheck";
import { getToast } from "util/functions";
import { motion } from "framer-motion";
import classNames from "classnames";
import { logEvent, logPageView } from "util/analytics";

const Joi = require("@hapi/joi");
console.log(Joi.version); // check joi works

const now = Date.now();
const cutoffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100); // go back by 21 years

const schema = Joi.object().keys({
  given_name: Joi.string()
    .min(3)
    .max(20)
    .capitalise()
    .required(),

  familyName: Joi.string()
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

function signUpValidation(param) {
  param.given_name = capitalise(param.given_name);
  param.familyName = capitalise(param.familyName);
  param.username = capitalise(param.username);
  param.email = param.email.toLowerCase();
  Joi.validate(
    {
      email: param.email.toLowerCase(),
      password: param.password,
      given_name: capitalise(param.given_name),
      username: capitalise(param.username),
      familyName: capitalise(param.familyName),
      birthdate: param.birthdate,
    },
    schema,
    (err, value) => {
      if (err) {
        // send a 422 error response if validation fails
        return err;
      } else {
        try {
          const user = Auth.signUp(param);
          console.log(user);
          return true;
        } catch (err) {
          return err;
        }
      }
    }
  );
}
function capitalise(str) {
  return str[0].toUpperCase() + str.slice(1).lowercase;
}
export default signUpValidation;

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
import { renderToStaticMarkup } from "react-dom/server";

const Joi = require("@hapi/joi");
console.log(Joi.version); // check joi works

const now = Date.now();
const cutoffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100); // go back by 21 years

const schema = Joi.object().keys({
  given_name: Joi.string()
    .min(3)
    .max(20)
    .required(),

  familyName: Joi.string()
    .min(3)
    .max(20)
    .required(),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .error(() => {
      return {
        message:
          "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers.",
      };
    }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])|(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])| (?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])"
      )
    )
    .required()
    .error(() => {
      return {
        message:
          "Please improve your password strength. This can be done by adding symbols, capitals, number or even just increasing it's length",
      };
    }),

  birthdate: Joi.string()
    .isoDate()
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .error(() => {
      return {
        message:
          "Email Incorrect. Your email is incorrect please double check this.",
      };
    }),
});

async function signUpValidation(email, pw, pw1, gn, un, fn, bd) {
  if (pw1 == pw) {
    if (bd < now && bd > cutoffDate) {
      try {
        const value = await schema.validateAsync({
          email: email,
          password: pw,
          given_name: gn,
          username: un,
          familyName: fn,
          birthdate: bd,
        });

        try {
          const param: SignUpParams = {
            username: email,
            password: pw,
            attributes: {
              given_name: capitalize(gn, true),
              family_name: capitalize(fn, true),
              birthdate: bd,
              preferred_username: capitalize(un, true),
            },
          };
          const user = Auth.signUp(param);
          console.log(user);
          return true;
        } catch (err) {
          return err;
        }
      } catch (err) {
        return err;
      }
    } else {
      return "DOB wrong";
    }
  } else {
    return "passwords don't match";
  }
}

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );
export default signUpValidation;

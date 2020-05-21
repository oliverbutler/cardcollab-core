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
    .message(
      "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers."
    )
    .max(20)
    .message(
      "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers."
    )
    .required(),

  familyName: Joi.string()
    .min(3)
    .message(
      "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers."
    )
    .max(20)
    .message(
      "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers."
    )
    .required(),

  username: Joi.string()
    .alphanum()
    .message(
      "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers."
    )
    .min(3)
    .message(
      "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers."
    )
    .max(30)
    .message(
      "Username Incorrect. Usernames have to be between 3 to 30 in length and be made up of letters and numbers."
    )
    .required(),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])|(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])| (?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])"
      )
    )
    .message(
      "Please improve your password strength. This can be done by adding symbols, capitals, number or even just increasing it's length"
    )
    .required(),
  birthdate: Joi.string()
    .isoDate()
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message(
      "Email Incorrect. Your email is incorrect please double check this."
    )
    .required(),
});

async function signUpValidation(email, pw, pw1, gn, un, fn, bd) {
  if (pw1 == pw) {
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
      console.log(err);
      console.log(err.toString());
      console.log("gayyyy");
      return err;
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

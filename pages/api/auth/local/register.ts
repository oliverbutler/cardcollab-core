import mongoose from "mongoose";
import dbConnect from "middleware/db";
import nanoid from "nanoid";
import getConfig from "next/config";
import { genSecret } from "util/auth";
import { IUser } from "models/user";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const register = async (req, res) => {
  const { User } = mongoose.models;

  var emailCallback = nanoid.nanoid();
  var body = {};

  body = { ...req.body };
  try {
    delete body["password"];
  } catch (any) {
    res.status(400).send("Must contain a password");
  }

  const user: IUser = await new User({
    ...body,
    secret: await genSecret(req.body.password.toString()),
    lastIp: req.connection.remoteAddress,
    lastLogin: Date.now(),
    emailCallback: emailCallback,
  });

  var mailgun = require("mailgun-js")({
    apiKey: serverRuntimeConfig.MAIL_GUN_API_KEY,
    domain: "mg.cardcollab.com",
    host: "api.eu.mailgun.net",
  });

  var data = {
    from: "CardCollab <noreply@cardcollab.com>",
    to: req.body.email,
    subject: "Email Confirmation",
    html: `<h1>Hi ${user.givenName}, Welcome to CardCollab!</h1><p>Click this link to confirm your email address.</p><p>https://cardcollab.com/api/auth/local/callback/${emailCallback}</p>`,
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) res.status(400).send("Error Sending Confirmation Email");
    res.status(201).send(user);
  });

  user
    .save()
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
};

export default dbConnect(register);

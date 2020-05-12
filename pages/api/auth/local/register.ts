import mongoose from "mongoose";
import dbConnect from "middleware/db";
import nanoid from "nanoid";
import getConfig from "next/config";
import { genSecret } from "util/auth";
import { IUser, IIdentity } from "models/user";
import { NextApiRequest, NextApiResponse } from "next";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { User, Identity } = mongoose.models;

  var emailCallback = nanoid.nanoid();
  var body = {};

  if (!req.body.password)
    return res.status(400).send("Must contain a password");

  body = { ...req.body };
  delete body["password"];

  const user: IUser = new User({
    ...body,
    lastIp: req.connection.remoteAddress,
    lastLogin: Date.now(),
    emailCallback: emailCallback,
  });

  const identity: IIdentity = await new Identity({
    provider: "local",
    id: user.id,
    isSocial: false,
    secret: genSecret(req.body.password.toString()),
  });

  user.identities.push(identity);

  await user
    .save()
    .catch((err) => {
      return res.status(400).send(err);
    })
    .then(async (user) => {
      if (user) {
        var mailgun = require("mailgun-js")({
          apiKey: serverRuntimeConfig.MAIL_GUN_API_KEY,
          domain: "mg.cardcollab.com",
          host: "api.eu.mailgun.net",
        });

        var data = {
          from: "CardCollab <noreply@cardcollab.com>",
          to: req.body.email,
          subject: "Email Confirmation",
          html: `<h1>Hi ${user.givenName}, Welcome to CardCollab!</h1> <p>Click this link to confirm your email address.</p><p>https://cardcollab.com/api/auth/local/callback/${emailCallback}</p>`,
        };

        await mailgun.messages().send(data, function (error, body) {
          if (error) {
            console.log("Mailgun failed");
            console.log(error);
            return res.status(400).send("Error Sending Confirmation Email");
          } else {
            return res.send(user);
          }
        });
      }
    });
};

export default dbConnect(register);

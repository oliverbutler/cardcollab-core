import mongoose from "mongoose";
import dbConnect from "../../../../middlewares/db";
import crypto from "crypto";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const register = async (req, res) => {
  const { User } = mongoose.models;

  var emailCallback = crypto.randomBytes(32).toString("hex");

  const user = new User({
    ...req.body,
    lastIp: req.connection.remoteAddress,
    lastLogin: Date.now(),
    emailCallback: emailCallback,
  });
  await user
    .save()
    .then(() => {
      var domain = "mg.cardcollab.com";
      var mailgun = require("mailgun-js")({
        apiKey: serverRuntimeConfig.MAIL_GUN_API_KEY,
        domain: domain,
        host: "api.eu.mailgun.net",
      });

      var data = {
        from: "CardCollab <noreply@cardcollab.com>",
        to: req.body.email,
        subject: "Email Confirmation",
        html: `<h1>Hi ${req.body.givenName}, Welcome to CardCollab!</h1><p>Click this link to confirm your email address.</p><p>https://cardcollab.com/api/auth/local/callback/${emailCallback}</p>`,
      };

      mailgun.messages().send(data, function (error, body) {
        if (error) res.status(400).send("Error Sending Confirmation Email");
        res.status(201).send(user);
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export default dbConnect(register);

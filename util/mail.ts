import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

var mailgun = require("mailgun-js")({
  apiKey: serverRuntimeConfig.MAIL_GUN_API_KEY,
  domain: "mg.cardcollab.com",
  host: "api.eu.mailgun.net",
});

export const sendEmailConfirmation = (
  email: string,
  givenName: string,
  callback: string
) => {
  var data = {
    from: "CardCollab <noreply@cardcollab.com>",
    to: email,
    subject: "Email Confirmation",
    html: `<h1>Hi ${givenName}, Welcome to CardCollab!</h1> <p>Click this link to confirm your email address.</p><p>https://cardcollab.com/api/auth/local/callback/${callback}</p>`,
  };

  return sendEmail(data);
};

export const sendEmail = async (data: {}) => {
  await mailgun.messages().send(data, function(error, body) {
    if (error) {
      console.log("Mailgun failed");
      console.log(error);
      return new Error("Mailgun Failed");
    } else {
      return "Success";
    }
  });
};

// next.config.js

var URL = "http://localhost:3000";
if (process.env.URL) URL = process.env.URL;

module.exports = {
  target: "serverless",
  webpack(config, options) {
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
  serverRuntimeConfig: {
    AWS_REGION: "eu-west-2",
    SECRET: process.env.SECRET,
    MONGO_DB: process.env.MONGO_DB,
    MAIL_GUN_API_KEY: process.env.MAIL_GUN_API_KEY,
    DEPLOY_TIME: new Date().toISOString(),
  },
};
